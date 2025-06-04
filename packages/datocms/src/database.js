"use strict";
/*
 * The purpose of this module is to manage inside of a Turso database the
 * associations between the GraphQL queries made to the DatoCMS Content Delivery
 * API, and the `Cache-Tags` that these requests return.
 *
 * To store these associations, we use a simple table `query_cache_tags`
 * composed of just two columns:
 *
 * - `query_id` (TEXT): A unique identifier for the query, used to tag the request;
 * - `cache_tag` (TEXT): An actual cache tag returned by the query.
 *
 * These associations will allow us to selectively invalidate individual GraphQL
 * queries, when we receive a "Cache Tags Invalidation" webhook from DatoCMS.
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.database = void 0;
exports.storeQueryCacheTags = storeQueryCacheTags;
exports.queriesReferencingCacheTags = queriesReferencingCacheTags;
exports.deleteQueries = deleteQueries;
exports.truncateAssociationsTable = truncateAssociationsTable;
var client_1 = require("@libsql/client");
/*
 * Creates and returns a Turso database client. Note the custom fetch method
 * provided to the Turso client. By setting the `cache` option to `no-store`, we
 * ensure that Next.js does not cache our HTTP requests for database calls.
 */
var database = function () {
    var _a, _b;
    return (0, client_1.createClient)({
        url: (_a = process.env.TURSO_DATABASE_URL) !== null && _a !== void 0 ? _a : (function () {
            throw new Error("TURSO_DATABASE_URL is not defined");
        })(),
        authToken: (_b = process.env.TURSO_AUTH_TOKEN) !== null && _b !== void 0 ? _b : (function () {
            throw new Error("TURSO_AUTH_TOKEN is not defined");
        })(),
        fetch: function (input, init) {
            return fetch(input, __assign(__assign({}, init), { cache: "no-store" }));
        },
    });
};
exports.database = database;
/*
 * Generates a string of SQL placeholders ('?') separated by commas.
 * It's useful for constructing SQL queries with varying numbers of parameters.
 */
function sqlPlaceholders(count) {
    return Array.from({ length: count }, function () { return "?"; }).join(",");
}
/*
 * Associates DatoCMS Cache Tags to a given GraphQL query. Within an implicit
 * transaction, it initially removes any existing tags for the given queryId,
 * and then adds the new ones. In case of a conflict (e.g. trying to insert a
 * duplicate entry), the operation simply does nothing.
 */
function storeQueryCacheTags(queryId, cacheTags) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exports.database)().execute({
                        sql: "\n      INSERT INTO query_cache_tags (query_id, cache_tag)\n      VALUES ".concat(cacheTags.map(function () { return "(?, ?)"; }).join(", "), "\n      ON CONFLICT DO NOTHING\n    "),
                        args: cacheTags.flatMap(function (cacheTag) { return [queryId, cacheTag]; }),
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/*
 * Retrieves the query hashs associated with specified cache tags.
 */
function queriesReferencingCacheTags(cacheTags) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exports.database)().execute({
                        sql: "\n      SELECT DISTINCT query_id\n      FROM query_cache_tags\n      WHERE cache_tag IN (".concat(sqlPlaceholders(cacheTags.length), ")\n    "),
                        args: cacheTags,
                    })];
                case 1:
                    rows = (_a.sent()).rows;
                    return [2 /*return*/, rows.map(function (row) { return row.query_id; })];
            }
        });
    });
}
/*
 * Removes all entries that reference the specified queries.
 */
function deleteQueries(queryIds) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exports.database)().execute({
                        sql: "\n      DELETE FROM query_cache_tags\n      WHERE query_id IN (".concat(sqlPlaceholders(queryIds.length), ")\n    "),
                        args: queryIds,
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/*
 * Wipes out all data contained in the table.
 */
function truncateAssociationsTable() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exports.database)().execute("DELETE FROM query_cache_tags")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
