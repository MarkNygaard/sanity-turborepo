import { defineRouting } from "next-intl/routing";

import { locales } from "../../../studio/config";

const localeData = {
  locales: locales.map((l) => l.id),
  defaultLocale: locales?.[0]?.id ?? "en",
};

const makeDynamicPath = (path: string) =>
  Object.fromEntries(localeData.locales.map((locale) => [locale, path]));

const dynamicPathnames = {
  "/[slug]": makeDynamicPath("/[slug]"),
};

export const routing = defineRouting({
  locales: localeData.locales,
  defaultLocale: localeData.defaultLocale,
  localePrefix: "as-needed",
  pathnames: dynamicPathnames,
});
