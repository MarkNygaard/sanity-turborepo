import type { Locale } from "next-intl";
import type { ReactNode } from "react";
import Footer from "components/Layout/Footer";
import Header from "components/Layout/Header";
import { LANGUAGES_QUERY } from "lib/sanity/query";

import { sanityFetch } from "@repo/sanity";

// import Meta from "components/Layout/Meta";

interface PageParams {
  children: ReactNode;
  params: {
    locale: Promise<Locale>;
  };
}

export default async function RootLayout({ children, params }: PageParams) {
  const { locale } = await params;

  const languages = await sanityFetch({
    query: LANGUAGES_QUERY,
  });

  return (
    <>
      {/* <Meta data={data} />*/}
      <Header language={locale} />
      <div className="flex-1">{children}</div>
      <Footer language={locale} languages={languages.data} />
    </>
  );
}
