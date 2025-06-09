import { client } from "@repo/sanity/client";

import { LANGUAGES_QUERY } from "../src/lib/sanity/query";

export async function fetchLocales() {
  try {
    const languages = await client.fetch(LANGUAGES_QUERY);

    if (!languages || languages.length === 0) {
      throw new Error("No languages found in Sanity");
    }

    const locales = languages.map((lang: any) => lang.code);
    const defaultLocale = "en-GB";

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
