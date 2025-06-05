import localeData from "./locales.config.json";

export interface Locale {
  code: string;
  title: string;
  isDefault: boolean;
}

// Get all available locales (from generated config)
export function getAvailableLocales(): Locale[] {
  return localeData.languages;
}

// Get default language for a specific market (still from Sanity at runtime if needed)
export async function getMarketDefaultLanguage(
  marketCode: string,
): Promise<string> {
  try {
    const { sanityFetch } = await import("@repo/sanity");
    const { MARKET_DEFAULT_LANGUAGE_QUERY } = await import(
      "../lib/sanity/query"
    );

    const marketResult = await sanityFetch({
      query: MARKET_DEFAULT_LANGUAGE_QUERY,
      params: { marketCode },
    });

    // Adjust the type as needed based on the actual result structure
    const defaultLanguageCode =
      marketResult.data?.defaultLanguage?.code ?? "en-GB";

    return defaultLanguageCode;
  } catch (error) {
    console.error(
      `Failed to fetch default language for market ${marketCode}:`,
      error,
    );
    return "en-GB";
  }
}
