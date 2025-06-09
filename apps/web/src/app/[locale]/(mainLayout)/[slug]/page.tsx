import type { Page } from "types/sanity";
import { notFound } from "next/navigation";
import PageBuilder from "components/PageBuilder";
import { routing } from "i18n/routing";
import { PAGE_QUERY } from "lib/sanity/query";
import { getLocale } from "next-intl/server";

import type { Response } from "@repo/sanity";
import { handleErrors, sanityFetch } from "@repo/sanity";

async function fetchSlugPageData(
  slug: string,
): Promise<Response<{ data: Page }>> {
  const locale = await getLocale();
  return await handleErrors(
    sanityFetch({
      query: PAGE_QUERY,
      params: { language: locale, slug: slug },
    }),
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [res, err] = await fetchSlugPageData(slug);

  if (err || !res?.data) {
    return notFound();
  }

  const { data } = res;

  if (!data.pageBuilder) return null;

  return <PageBuilder blocks={data.pageBuilder} />;
}
