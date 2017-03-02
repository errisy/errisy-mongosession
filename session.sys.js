"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
//Data Service file generate by RPC compiler.
//All your data definitions should be in the same *.data.ts file.
var errisy_mongo_1 = require("errisy-mongo");
var rpc = require("errisy-rpc");
var SessionDataQuery = (function () {
    function SessionDataQuery() {
    }
    return SessionDataQuery;
}());
exports.SessionDataQuery = SessionDataQuery;
var SessionDataCollection = (function (_super) {
    __extends(SessionDataCollection, _super);
    function SessionDataCollection() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'SessionData';
        return _this;
    }
    return SessionDataCollection;
}(errisy_mongo_1.EntityCollection));
exports.SessionDataCollection = SessionDataCollection;
var SessionDataProject = (function () {
    function SessionDataProject() {
        var $dict = {};
    }
    return SessionDataProject;
}());
exports.SessionDataProject = SessionDataProject;
var sessionDataSet = (function (_super) {
    __extends(sessionDataSet, _super);
    function sessionDataSet() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    sessionDataSet.prototype.SessionData = function (suffix) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.$db) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.$connect()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, new Promise(function (resolve, reject) {
                            resolve(new SessionDataCollection(_this.$db, suffix));
                        })];
                }
            });
        });
    };
    Object.defineProperty(sessionDataSet.prototype, "$Entities", {
        get: function () {
            return [
                new rpc.EntityDefinition("SessionData", [
                    new rpc.FieldDefinition("_id", "string"),
                    new rpc.FieldDefinition("value", "string"),
                    new rpc.FieldDefinition("expiryTime", "number")
                ])
            ];
        },
        enumerable: true,
        configurable: true
    });
    sessionDataSet.prototype.$Collection = function (definition, suffix) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = definition.Name;
                        switch (_a) {
                            case 'SessionData': return [3 /*break*/, 1];
                        }
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.SessionData(suffix)];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    sessionDataSet.prototype.$initializeIndices = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.SessionData()];
                    case 1: return [4 /*yield*/, (_a.sent()).createIndex({ _id: 1 })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.SessionData()];
                    case 3: return [4 /*yield*/, (_a.sent()).createIndex({ expiryTime: 1 })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    return sessionDataSet;
}(errisy_mongo_1.DataSet));
exports.sessionDataSet = sessionDataSet;
//# sourceMappingURL=session.sys.js.map