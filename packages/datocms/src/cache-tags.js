"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseXCacheTagsResponseHeader = parseXCacheTagsResponseHeader;
/**
 * Converts the value of DatoCMS's `X-Cache-Tags` header into an array of
 * strings typed as `CacheTag`. For example, it transforms `'tag-a tag-2 other-tag'`
 * into `['tag-a', 'tag-2', 'other-tag']`.
 */
function parseXCacheTagsResponseHeader(string) {
    if (!string)
        return [];
    return string.split(" ").map(function (tag) { return tag; });
}
