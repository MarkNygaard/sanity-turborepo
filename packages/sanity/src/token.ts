import "server-only";

export const token = process.env.SANITY_STUDIO_API_TOKEN;

if (!token) {
  throw new Error("Missing SANITY_STUDIO_API_TOKEN");
}
