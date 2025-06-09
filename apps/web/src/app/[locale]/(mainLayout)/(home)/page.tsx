import type { HomePage } from "types/sanity";
import PageBuilder from "components/PageBuilder";
import { routing } from "i18n/routing";
import { HOME_PAGE_QUERY } from "lib/sanity/query";
import { getLocale } from "next-intl/server";

// import { getMetaData } from "utils/seo";

import { sanityFetch } from "@repo/sanity";

async function fetchHomePageData() {
  const locale = await getLocale();
  const result = await sanityFetch({
    query: HOME_PAGE_QUERY,
    params: { language: locale },
  });
  return result.data as HomePage;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage() {
  const data = await fetchHomePageData();

  if (!data.pageBuilder) return null;

  return <PageBuilder blocks={data.pageBuilder} />;
}
