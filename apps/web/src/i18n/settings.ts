import { sanityFetch } from "@repo/sanity";

import { locales } from "../../../studio/config";

export default async function getAvailableLocales() {
  return locales;
}

// Export the locales for use in other parts of the application
export { locales };

export async function getFallbackLocale() {
  return locales[0]; //using the first ordered locale as fallback
}
