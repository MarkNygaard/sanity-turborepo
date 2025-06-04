import type { ReactNode } from "react";

// import Footer from "components/Layout/Footer";
// import Header from "components/Layout/Header";
// import Meta from "components/Layout/Meta";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* <Meta data={data} />
      <Header data={data} /> */}
      <div className="flex-1">{children}</div>
      {/* <Footer data={data} languages={data._site.locales} /> */}
    </>
  );
}
