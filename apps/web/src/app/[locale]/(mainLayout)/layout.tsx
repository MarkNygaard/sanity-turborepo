import type { Locale } from "next-intl";
import type { ReactNode } from "react";
// import Footer from "components/Layout/Footer";
import Header from "components/Layout/Header";

// import Meta from "components/Layout/Meta";

interface PageParams {
  children: ReactNode;
  params: {
    locale: Promise<Locale>;
  };
}

export default async function RootLayout({ children, params }: PageParams) {
  const { locale } = await params;

  const [, market = ""] = locale.split("-");

  return (
    <>
      {/* <Meta data={data} />*/}
      <Header language={locale} market={market} />
      <div className="flex-1">{children}</div>
      {/* <Footer data={data} languages={data._site.locales} /> */}
    </>
  );
}
