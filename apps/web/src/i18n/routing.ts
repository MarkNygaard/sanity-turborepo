import { defineRouting } from "next-intl/routing";

import { sanityFetch } from "@repo/sanity";

function getLocaleData() {
  const data = await sanityFetch({
    query: languagesQuery,
  });
  return {
    locales: data.languages.map((l) => l.code),
  };
}

const makeDynamicPath = (path: string) =>
  Object.fromEntries(localeData.locales.map((locale) => [locale, path]));

const dynamicPathnames = {
  "/[slug]": makeDynamicPath("/[slug]"),
};

export const routing = defineRouting({
  locales: localeData.locales,
  defaultLocale: "en-GB",
  localePrefix: "as-needed",
  pathnames: dynamicPathnames,
});
