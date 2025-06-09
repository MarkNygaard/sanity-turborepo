import { createClient } from "@sanity/client";

import { LANGUAGES_QUERY } from "../src/lib/sanity/query";

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,
  useCdn: false,
  apiVersion: process.env.SANITY_STUDIO_APIVERSION || "2025-03-01",
  token: process.env.SANITY_STUDIO_API_TOKEN,
});

export async function fetchLocales() {
  try {
    const languages = await client.fetch(LANGUAGES_QUERY);

    if (!languages || languages.length === 0) {
      throw new Error("No languages found in Sanity");
    }

    const locales = languages.map((lang: any) => lang.code);
    const defaultLocale = "en-GB"; // Global default for next-intl

    return {
      locales,
      defaultLocale,
      languages: languages.map((lang: any) => ({
        code: lang.code,
        title: lang.title,
        isDefault: lang.isDefault || false,
      })),
    };
  } catch (error) {
    console.error("Failed to fetch locales from Sanity:", error);

    // Fallback configuration
    return {
      locales: ["en-GB"],
      defaultLocale: "en-GB",
      languages: [{ code: "en-GB", title: "English (UK)", isDefault: false }],
    };
  }
}
