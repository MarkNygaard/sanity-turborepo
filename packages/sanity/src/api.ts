function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}

export const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";

export const projectId = assertValue(
  process.env.SANITY_STUDIO_PROJECT_ID,
  "Missing environment variable: SANITY_STUDIO_PROJECT_ID",
);

export const apiVersion = process.env.SANITY_API_VERSION || "2023-05-03";

export const studioUrl =
  process.env.SANITY_STUDIO_URL || "http://localhost:3333";

if (!projectId) {
  throw new Error("SANITY_STUDIO_PROJECT_ID");
}

if (!dataset) {
  throw new Error("Missing SANITY_STUDIO_DATASET");
}
