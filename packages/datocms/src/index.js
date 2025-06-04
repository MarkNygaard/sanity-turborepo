"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = exports.truncateAssociationsTable = exports.deleteQueries = exports.queriesReferencingCacheTags = exports.storeQueryCacheTags = exports.parseXCacheTagsResponseHeader = exports.executeQueryWithoutMemoization = exports.queryDatoCMS = void 0;
var datocms_1 = require("./datocms");
Object.defineProperty(exports, "queryDatoCMS", { enumerable: true, get: function () { return datocms_1.queryDatoCMS; } });
Object.defineProperty(exports, "executeQueryWithoutMemoization", { enumerable: true, get: function () { return datocms_1.executeQueryWithoutMemoization; } });
var cache_tags_1 = require("./cache-tags");
Object.defineProperty(exports, "parseXCacheTagsResponseHeader", { enumerable: true, get: function () { return cache_tags_1.parseXCacheTagsResponseHeader; } });
var database_1 = require("./database");
Object.defineProperty(exports, "storeQueryCacheTags", { enumerable: true, get: function () { return database_1.storeQueryCacheTags; } });
Object.defineProperty(exports, "queriesReferencingCacheTags", { enumerable: true, get: function () { return database_1.queriesReferencingCacheTags; } });
Object.defineProperty(exports, "deleteQueries", { enumerable: true, get: function () { return database_1.deleteQueries; } });
Object.defineProperty(exports, "truncateAssociationsTable", { enumerable: true, get: function () { return database_1.truncateAssociationsTable; } });
Object.defineProperty(exports, "database", { enumerable: true, get: function () { return database_1.database; } });
// Validate environment variables
function validateEnvironmentVariables() {
    var requiredVariables = [
        "DATOCMS_READONLY_API_TOKEN",
        "DATOCMS_ENVIRONMENT",
        "CACHE_INVALIDATION_SECRET_TOKEN",
        "DRAFT_SECRET_TOKEN",
        "TURSO_DATABASE_URL",
        "TURSO_AUTH_TOKEN",
        "URL",
    ];
    requiredVariables.forEach(function (varName) {
        if (!process.env[varName]) {
            throw new Error("Environment variable ".concat(varName, " is not defined."));
        }
    });
}
// Perform validation when the package is imported
validateEnvironmentVariables();
