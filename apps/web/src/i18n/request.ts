import { languagesQuery } from "lib/sanity/query";
import { hasLocale } from "next-intl";
import { defineRouting } from "next-intl/routing";
import { getRequestConfig } from "next-intl/server";

const localeData = {
  locales: locales.map((l) => l.id),
  defaultLocale: locales[0]?.id ?? "en",
};

const routing = defineRouting({
  locales: localeData.locales,
  defaultLocale: localeData.defaultLocale,
});

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: {},
  };
});
