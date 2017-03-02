import * as rpc from 'errisy-rpc';

@rpc.entity
export class SessionData {
    @rpc.index.ascending
    public _id: string;
    public value: string;
    @rpc.index.ascending
    public expiryTime: number;
}