"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
try{
    if(require.resolve("errisy-task")){
        let ErrisyTask = require("errisy-task");
        __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
            return new (P || (P = ErrisyTask))(function (resolve, reject, t) {
                if(t){
                    function fulfilled(value) { try { if(!t.cancelled) step(generator.next(value)); } catch (e) { reject(e); } }
                    function rejected(value) { try { if(!t.cancelled) step(generator["throw"](value)); } catch (e) { reject(e); } }
                    function step(result) { t.clear(), result.done ? resolve(result.value) : t.append(new P(function (resolve) { resolve(result.value); })).then(fulfilled, rejected); }
                    step((generator = generator.apply(thisArg, _arguments || [])).next()); 
                }
                else{
                    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
                    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
                    function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
                    step((generator = generator.apply(thisArg, _arguments || [])).next());
                }
            });
        }
    }
}
catch(e){}
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
var util = require("errisy-util");
var cookie = require("cookie");
var session_sys_1 = require("./session.sys");
var session_data_1 = require("./session.data");
var errisy_mongo_1 = require("errisy-mongo");
/**
 * this is the algorithm to encrypt and decrypt session data for client side session;
 */
var algorithm = 'aes-256-gcm';
var MongoSessionMiddleware = (function () {
    /**
     *
     * @param secret secret is the standard aes 256 secret for the session encrption
     * @param expiryPeroid by default, expiryPeroid is 30min
     * @param shuffle when shuffle is set true, the algorithm will make sure there is no similarity in every time's session data
     */
    function MongoSessionMiddleware(DBConnectionString, encryptionKey, expiryPeroid, shuffle) {
        var _this = this;
        this.DBConnectionString = DBConnectionString;
        this.encryptionKey = encryptionKey;
        this.expiryPeroid = expiryPeroid;
        this.shuffle = shuffle;
        this.IDBuilder = new errisy_mongo_1.TimeUniqueIDBuilder();
        this.handler = function (request, response) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.Collection) return [3 /*break*/, 2];
                        this.DataSet = new session_sys_1.sessionDataSet(this.DBConnectionString);
                        _a = this;
                        return [4 /*yield*/, this.DataSet.SessionData()];
                    case 1:
                        _a.Collection = _b.sent();
                        _b.label = 2;
                    case 2:
                        new MongoSession(request, response, this);
                        return [2 /*return*/, true];
                }
            });
        }); };
        if (typeof this.expiryPeroid != 'number' || Number.isNaN(this.expiryPeroid))
            this.expiryPeroid = 30 * 60 * 1000;
    }
    /**
     * encrypt string value for client side
     * @param value
     */
    MongoSessionMiddleware.prototype.encrypt = function (value) {
        if (this.shuffle) {
            var code = util.randomstring(32);
            var mixer = crypto.createCipher(algorithm, code);
            var encrypted = mixer.update(value, 'utf8', 'hex');
            encrypted += mixer.final('hex');
            encrypted = mixer.getAuthTag().toString('hex') + "+" + encrypted;
            var encryptor = crypto.createCipher(algorithm, this.encryptionKey);
            var secret = encryptor.update(code, 'utf8', 'hex');
            secret += encryptor.final('hex');
            secret = encryptor.getAuthTag().toString('hex') + "+" + secret;
            return encrypted + "+" + secret;
        }
        else {
            var encryptor = crypto.createCipher(algorithm, this.encryptionKey);
            var secret = encryptor.update(value, 'utf8', 'hex');
            secret += encryptor.final('hex');
            secret = encryptor.getAuthTag().toString('hex') + "+" + secret;
            return "" + secret;
        }
    };
    /**
     * decrypt string value from client side
     * @param value
     */
    MongoSessionMiddleware.prototype.decrypt = function (value) {
        if (this.shuffle) {
            var arr = value.split('+');
            var decryptor = crypto.createDecipher(algorithm, this.encryptionKey);
            decryptor.setAuthTag(new Buffer(arr[2], 'hex'));
            var code = decryptor.update(arr[3], 'hex', 'utf8');
            code += decryptor.final('utf8');
            var mixer = crypto.createDecipher(algorithm, code);
            mixer.setAuthTag(new Buffer(arr[0], 'hex'));
            var decrypted = mixer.update(arr[1], 'hex', 'utf8');
            decrypted += mixer.final('utf8');
            return decrypted;
        }
        else {
            var arr = value.split('+');
            var mixer = crypto.createDecipher(algorithm, this.encryptionKey);
            mixer.setAuthTag(new Buffer(arr[0], 'hex'));
            var decrypted = mixer.update(arr[1], 'hex', 'utf8');
            decrypted += mixer.final('utf8');
            return decrypted;
        }
    };
    return MongoSessionMiddleware;
}());
exports.MongoSessionMiddleware = MongoSessionMiddleware;
var MongoSession = (function () {
    function MongoSession(request, response, middleware) {
        this.request = request;
        this.response = response;
        this.middleware = middleware;
        request['session'] = this;
        response['session'] = this;
        var value = request.headers['cookie'];
        if (value && typeof value == 'string') {
            this.SessionKey = cookie.parse(value)['session'];
        }
        if (this.SessionKey) {
            this.response.setHeader('Set-Cookie', cookie.serialize('session', this.middleware.encrypt(this.SessionKey), { maxAge: this.middleware.expiryPeroid, httpOnly: true }));
        }
    }
    MongoSession.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, data, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.SessionKey) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.middleware.Collection.findOne({ _id: this.SessionKey })];
                    case 1:
                        result = _a.sent();
                        try {
                            this.DataObject = JSON.parse(result.value);
                        }
                        catch (ex) {
                            this.DataObject = {};
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        data = new session_data_1.SessionData();
                        data.value = '{}';
                        data.expiryTime = Date.now() + this.middleware.expiryPeroid;
                        return [4 /*yield*/, this.middleware.Collection.insertOneWithCustomID(data, this.middleware.IDBuilder)];
                    case 3:
                        result = _a.sent();
                        this.SessionKey = result.insertedId;
                        this.DataObject = {};
                        _a.label = 4;
                    case 4:
                        if (this.SessionKey) {
                            this.response.setHeader('Set-Cookie', cookie.serialize('session', this.middleware.encrypt(this.SessionKey), { maxAge: this.middleware.expiryPeroid, httpOnly: true }));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    MongoSession.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Obj, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.load()];
                    case 1:
                        _a.sent();
                        Obj = {};
                        for (key in this.DataObject) {
                            if (!this.DataObject[key].flash) {
                                Obj[key] = { value: this.DataObject[key].value };
                                if (typeof this.DataObject[key].expiryTime == 'number')
                                    Obj[key].expiryTime = this.DataObject[key].expiryTime;
                                if (this.DataObject[key].reflash)
                                    Obj[key].flash = true;
                            }
                        }
                        this.response.setHeader('Set-Cookie', cookie.serialize('session', this.middleware.encrypt(JSON.stringify(Obj)), { maxAge: this.middleware.expiryPeroid, httpOnly: true }));
                        return [4 /*yield*/, this.middleware.Collection.updateOne({ _id: this.SessionKey }, { $set: { value: JSON.stringify(Obj) } })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MongoSession.prototype.put = function (key, value, expiryTime) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.load()];
                    case 1:
                        _a.sent();
                        this.DataObject[key] = { value: value };
                        if (typeof expiryTime == 'number') {
                            this.DataObject[key]['expiryTime'] = expiryTime;
                        }
                        return [4 /*yield*/, this.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MongoSession.prototype.get = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.DataObject[key].value];
            });
        });
    };
    MongoSession.prototype.delete = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.load()];
                    case 1:
                        _a.sent();
                        delete this.DataObject[key];
                        return [4 /*yield*/, this.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MongoSession.prototype.flush = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.load()];
                    case 1:
                        _a.sent();
                        this.DataObject = {};
                        this.save();
                        return [2 /*return*/];
                }
            });
        });
    };
    MongoSession.prototype.flash = function (key, value, expiryTime) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.load()];
                    case 1:
                        _a.sent();
                        this.DataObject[key] = { value: value, reflash: true };
                        if (typeof expiryTime == 'number') {
                            this.DataObject[key]['expiryTime'] = expiryTime;
                        }
                        return [4 /*yield*/, this.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MongoSession.prototype.reflash = function () {
        return __awaiter(this, void 0, void 0, function () {
            var key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.load()];
                    case 1:
                        _a.sent();
                        for (key in this.DataObject) {
                            if (this.DataObject[key].flash)
                                this.DataObject[key].reflash = true;
                        }
                        return [4 /*yield*/, this.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return MongoSession;
}());
exports.MongoSession = MongoSession;
//# sourceMappingURL=index.js.map