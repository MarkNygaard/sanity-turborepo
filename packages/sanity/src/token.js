"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.token = void 0;
require("server-only");
exports.token = process.env.SANITY_API_READ_TOKEN;
if (!exports.token) {
    throw new Error("Missing SANITY_API_READ_TOKEN");
}
