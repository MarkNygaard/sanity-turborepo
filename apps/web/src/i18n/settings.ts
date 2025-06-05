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
