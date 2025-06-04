"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlFor = exports.client = void 0;
var image_url_1 = require("@sanity/image-url");
var next_sanity_1 = require("next-sanity");
var api_1 = require("./api");
exports.client = (0, next_sanity_1.createClient)({
    projectId: api_1.projectId,
    dataset: api_1.dataset,
    apiVersion: api_1.apiVersion,
    useCdn: process.env.NODE_ENV === "production",
    perspective: "published",
    stega: {
        studioUrl: api_1.studioUrl,
        enabled: process.env.NEXT_PUBLIC_VERCEL_ENV === "preview",
    },
});
var imageBuilder = (0, image_url_1.default)({
    projectId: api_1.projectId,
    dataset: api_1.dataset,
});
var urlFor = function (source) {
    return imageBuilder.image(source).auto("format").fit("max").format("webp");
};
exports.urlFor = urlFor;
