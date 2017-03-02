import * as crypto from 'crypto';
import * as util from 'errisy-util';
import * as http from 'http';
import * as cookie from 'cookie';
import * as rpc from 'errisy-rpc';

import { IPromisedMiddleware, ISession } from 'errisy-server';

import { sessionDataSet, SessionDataCollection, SessionDataQuery, SessionDataProject } from './session.sys';
import { SessionData } from './session.data';
import { TimeUniqueIDBuilder } from 'errisy-mongo';

/**
 * this is the algorithm to encrypt and decrypt session data for client side session;
 */
const algorithm = 'aes-256-gcm';


export class MongoSessionMiddleware implements IPromisedMiddleware {
    /**
     * 
     * @param secret secret is the standard aes 256 secret for the session encrption
     * @param expiryPeroid by default, expiryPeroid is 30min
     * @param shuffle when shuffle is set true, the algorithm will make sure there is no similarity in every time's session data
     */
    public constructor(public DBConnectionString: string, public encryptionKey: string, public expiryPeroid?: number, public shuffle?: boolean) {
        if (typeof this.expiryPeroid != 'number' || Number.isNaN(this.expiryPeroid)) this.expiryPeroid = 30 * 60 * 1000;
    }
    public DataSet: sessionDataSet;
    public Collection: SessionDataCollection;
    public IDBuilder = new TimeUniqueIDBuilder();
    /**
     * encrypt string value for client side
     * @param value
     */
    public encrypt(value: string): string {

        if (this.shuffle) {
            let code = util.randomstring(32);

            let mixer = crypto.createCipher(algorithm, code);
            let encrypted = mixer.update(value, 'utf8', 'hex');
            encrypted += mixer.final('hex');
            encrypted = `${mixer.getAuthTag().toString('hex')}+${encrypted}`;

            let encryptor = crypto.createCipher(algorithm, this.encryptionKey);
            let secret = encryptor.update(code, 'utf8', 'hex');
            secret += encryptor.final('hex');
            secret = `${encryptor.getAuthTag().toString('hex')}+${secret}`;

            return `${encrypted}+${secret}`;
        }
        else {
            let encryptor = crypto.createCipher(algorithm, this.encryptionKey);
            let secret = encryptor.update(value, 'utf8', 'hex');
            secret += encryptor.final('hex');
            secret = `${encryptor.getAuthTag().toString('hex')}+${secret}`;

            return `${secret}`;
        }

    }
    /**
     * decrypt string value from client side
     * @param value
     */
    public decrypt(value: string): string {
        if (this.shuffle) {
            let arr = value.split('+');

            let decryptor = crypto.createDecipher(algorithm, this.encryptionKey);
            decryptor.setAuthTag(new Buffer(arr[2], 'hex'));
            let code = decryptor.update(arr[3], 'hex', 'utf8');
            code += decryptor.final('utf8');

            let mixer = crypto.createDecipher(algorithm, code);
            mixer.setAuthTag(new Buffer(arr[0], 'hex'));
            let decrypted = mixer.update(arr[1], 'hex', 'utf8');
            decrypted += mixer.final('utf8');

            return decrypted;
        }
        else {
            let arr = value.split('+');
            let mixer = crypto.createDecipher(algorithm, this.encryptionKey);
            mixer.setAuthTag(new Buffer(arr[0], 'hex'));
            let decrypted = mixer.update(arr[1], 'hex', 'utf8');
            decrypted += mixer.final('utf8');

            return decrypted;
        }
    }
    handler = async (request: http.ServerRequest, response: http.ServerResponse): Promise<boolean> => {
        if (!this.Collection) {
            this.DataSet = new sessionDataSet(this.DBConnectionString);
            this.Collection = await this.DataSet.SessionData();
        }
        new MongoSession(request, response, this);
        return true;
    }
}

export interface ISessionData {
    value: string;
    flash?: boolean;
    expiryTime?: number;
    reflash?: boolean;
}

export class MongoSession implements ISession {
    public constructor(public request: http.ServerRequest, public response: http.ServerResponse, public middleware: MongoSessionMiddleware) {
        request['session'] = this;
        response['session'] = this;
        let value = request.headers['cookie'];
        if (value && typeof value == 'string') {
            this.SessionKey = cookie.parse(value)['session'];
        }
        if (this.SessionKey) {
            this.response.setHeader('Set-Cookie',
                cookie.serialize(
                    'session',
                    this.middleware.encrypt(this.SessionKey),
                    { maxAge: this.middleware.expiryPeroid, httpOnly: true }
                ));
        }
    }
    public SessionKey: string;
    private DataObject: { [key: string]: ISessionData }; //this should be undefined by default
    public async load() {
        //check session key
        if (this.SessionKey) { //if valid, get dataobject;
            let result = await this.middleware.Collection.findOne({ _id: this.SessionKey });
            try {
                this.DataObject = JSON.parse(result.value);
            }
            catch (ex) {
                this.DataObject = {};
            }
        }
        else { //if not valid, create session key and dataobject
            let data = new SessionData();
            data.value = '{}';
            data.expiryTime = Date.now() + this.middleware.expiryPeroid;
            let result = await this.middleware.Collection.insertOneWithCustomID(data, this.middleware.IDBuilder);
            this.SessionKey = <any>result.insertedId;
            this.DataObject = {};
        }
        if (this.SessionKey) {
            this.response.setHeader('Set-Cookie',
                cookie.serialize(
                    'session',
                    this.middleware.encrypt(this.SessionKey),
                    { maxAge: this.middleware.expiryPeroid, httpOnly: true }
                ));
        }
    }
    public async save() {
        await this.load();
        //save the data to database
        let Obj: { [key: string]: ISessionData } = {};
        for (let key in this.DataObject) {
            if (!this.DataObject[key].flash) {
                Obj[key] = { value: this.DataObject[key].value };
                if (typeof this.DataObject[key].expiryTime == 'number') Obj[key].expiryTime = this.DataObject[key].expiryTime;
                if (this.DataObject[key].reflash) Obj[key].flash = true;
            }
        }
        this.response.setHeader('Set-Cookie',
            cookie.serialize(
                'session',
                this.middleware.encrypt(JSON.stringify(Obj)),
                { maxAge: this.middleware.expiryPeroid, httpOnly: true }
            ));

        await this.middleware.Collection.updateOne({ _id: this.SessionKey }, { $set: { value: JSON.stringify(Obj) } });
    }
    public async put(key: string, value: string, expiryTime?: number): Promise<void> {
        await this.load();
        this.DataObject[key] = { value: value };
        if (typeof expiryTime == 'number') {
            this.DataObject[key]['expiryTime'] = expiryTime;
        }
        await this.save();
    }
    public async get(key: string): Promise<string> {
        return this.DataObject[key].value;
    }
    public async delete(key: string): Promise<void> {
        await this.load();
        delete this.DataObject[key];
        await this.save();
    }
    public async flush(): Promise<void> {
        await this.load();
        this.DataObject = {};
        this.save();
    }
    public async flash(key: string, value: string, expiryTime?: number): Promise<void> {
        await this.load();
        this.DataObject[key] = { value: value, reflash: true };
        if (typeof expiryTime == 'number') {
            this.DataObject[key]['expiryTime'] = expiryTime;
        }
        await this.save();
    }
    public async reflash(): Promise<void> {
        await this.load();
        for (let key in this.DataObject) {
            if (this.DataObject[key].flash) this.DataObject[key].reflash = true;
        }
        await this.save();
    }
}