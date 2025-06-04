"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SanityLive = exports.sanityFetch = void 0;
exports.urlFor = urlFor;
var image_url_1 = require("@sanity/image-url");
var next_sanity_1 = require("next-sanity");
var client_1 = require("./client");
var token_1 = require("./token");
/**
 * Use defineLive to enable automatic revalidation and refreshing of your fetched content
 * Learn more: https://github.com/sanity-io/next-sanity?tab=readme-ov-file#1-configure-definelive
 */
exports.sanityFetch = (_a = (0, next_sanity_1.defineLive)({
    client: client_1.client,
    // Required for showing draft content when the Sanity Presentation Tool is used, or to enable the Vercel Toolbar Edit Mode
    serverToken: token_1.token,
    // Required for stand-alone live previews, the token is only shared to the browser if it's a valid Next.js Draft Mode session
    browserToken: token_1.token,
}), _a.sanityFetch), exports.SanityLive = _a.SanityLive;
var builder = (0, image_url_1.default)(client_1.client);
function urlFor(source) {
    return builder.image(source);
}
