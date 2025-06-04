"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.studioUrl = exports.apiVersion = exports.projectId = exports.dataset = void 0;
function assertValue(v, errorMessage) {
    if (v === undefined) {
        throw new Error(errorMessage);
    }
    return v;
}
exports.dataset = (_a = process.env.NEXT_PUBLIC_SANITY_DATASET) !== null && _a !== void 0 ? _a : "production";
exports.projectId = assertValue(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID");
exports.apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-05-03";
exports.studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "http://localhost:3333";
if (!exports.projectId) {
    throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
}
if (!exports.dataset) {
    throw new Error("Missing NEXT_PUBLIC_SANITY_DATASET");
}
