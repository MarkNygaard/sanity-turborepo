import type { HomePage } from "types/sanity";
import PageBuilder from "components/PageBuilder";
import { homeQuery } from "lib/sanity/query";
import { getLocale } from "next-intl/server";

// import { getMetaData } from "utils/seo";

import { sanityFetch } from "@repo/sanity";

async function fetchHomePageData() {
  const locale = await getLocale();
  const docId = `homePage-${locale}`;
  const result = await sanityFetch({
    query: homeQuery,
    params: { docId },
  });
  return result.data as HomePage;
}

// export async function generateMetadata() {
//   const locale = await getLocale();
//   const data = await fetchHomePageData(locale);
//   return await getMetaData(data);
// }

export default async function HomePage() {
  const data = await fetchHomePageData();

  if (!data.pageBuilder) return null;

  return <PageBuilder blocks={data.pageBuilder} />;
}
