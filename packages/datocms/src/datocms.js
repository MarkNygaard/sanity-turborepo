"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
exports.queryDatoCMS = void 0;
exports.executeQueryWithoutMemoization = executeQueryWithoutMemoization;
var react_1 = require("react");
var cda_client_1 = require("@datocms/cda-client");
var graphql_1 = require("graphql");
var safe_stable_stringify_1 = require("safe-stable-stringify");
var cache_tags_1 = require("./cache-tags");
var database_1 = require("./database");
function getExplicitEnvironment() {
    var env = process.env.NEXT_PUBLIC_ENVIRONMENT;
    var datoEnv = process.env.DATOCMS_ENVIRONMENT;
    // In development/staging: use override
    if (env !== "production" && datoEnv)
        return datoEnv;
    // In production: let DatoCMS use the current promoted environment
    return undefined;
}
function executeQueryWithoutMemoization(document, variables, isDraft) {
    return __awaiter(this, void 0, void 0, function () {
        var headers, queryId, _a, data, response, cacheTags;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!process.env.DATOCMS_READONLY_API_TOKEN) {
                        throw new Error("Missing DatoCMS API token.");
                    }
                    headers = {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "X-Exclude-Invalid": "true",
                        Authorization: "Bearer ".concat(process.env.DATOCMS_READONLY_API_TOKEN),
                    };
                    if (isDraft || process.env.NODE_ENV === "development") {
                        headers["X-Include-Drafts"] = "true";
                    }
                    return [4 /*yield*/, generateQueryId(document, variables)];
                case 1:
                    queryId = _b.sent();
                    return [4 /*yield*/, (0, cda_client_1.rawExecuteQuery)(document, {
                            token: process.env.DATOCMS_READONLY_API_TOKEN,
                            excludeInvalid: true,
                            returnCacheTags: true,
                            variables: variables,
                            environment: getExplicitEnvironment(),
                            requestInitOptions: {
                                cache: "force-cache",
                                next: {
                                    tags: [queryId],
                                },
                            },
                        })];
                case 2:
                    _a = _b.sent(), data = _a[0], response = _a[1];
                    cacheTags = (0, cache_tags_1.parseXCacheTagsResponseHeader)(response.headers.get("x-cache-tags"));
                    return [4 /*yield*/, (0, database_1.storeQueryCacheTags)(queryId, cacheTags)];
                case 3:
                    _b.sent();
                    return [2 /*return*/, data];
            }
        });
    });
}
function generateQueryId(document, variables) {
    return __awaiter(this, void 0, void 0, function () {
        var encoder, hashInput, data, hashBuffer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    encoder = new TextEncoder();
                    hashInput = (0, graphql_1.print)(document) + (0, safe_stable_stringify_1.default)(variables !== null && variables !== void 0 ? variables : {});
                    data = encoder.encode(hashInput);
                    return [4 /*yield*/, crypto.subtle.digest("SHA-1", data)];
                case 1:
                    hashBuffer = _a.sent();
                    return [2 /*return*/, Array.from(new Uint8Array(hashBuffer))
                            .map(function (b) { return b.toString(16).padStart(2, "0"); })
                            .join("")];
            }
        });
    });
}
exports.queryDatoCMS = cacheWithDeepCompare(executeQueryWithoutMemoization);
function cacheWithDeepCompare(fn) {
    var cachedFn = (0, react_1.cache)(function (serialized) {
        return Promise.resolve(fn.apply(void 0, JSON.parse(serialized)));
    });
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var serialized = JSON.stringify(args);
        return cachedFn(serialized);
    };
}
