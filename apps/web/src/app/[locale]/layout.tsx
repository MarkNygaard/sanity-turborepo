import "styles/globals.css";

import type { HistoryRefresh } from "@sanity/visual-editing";
import type { Locale } from "next-intl";
import type { ReactNode } from "react";
import { revalidatePath, revalidateTag } from "next/cache";
import { Inter } from "next/font/google";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { PreviewBar } from "components/ui/PreviewBar";
import { routing } from "i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { VisualEditing } from "next-sanity";
import { preconnect, prefetchDNS } from "react-dom";

import { SanityLive } from "@repo/sanity";

const inter = Inter({ subsets: ["latin"] });

interface PageParams {
  children: ReactNode;
  params: {
    locale: Promise<Locale>;
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Layout({ children, params }: PageParams) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  preconnect("https://cdn.sanity.io");
  prefetchDNS("https://cdn.sanity.io");

  const { isEnabled } = await draftMode();

  const visualEditingRefresh = async (payload: HistoryRefresh) => {
    "use server";
    if (payload.source === "manual") {
      revalidatePath("/", "layout");
      return;
    }
    const doc = payload.document;
    const id = doc._id.startsWith("drafts.") ? doc._id.slice(7) : doc._id;
    const slug = doc.slug?.current;
    const type = doc._type;

    await Promise.all(
      [id, slug, type]
        .filter((tag): tag is string => typeof tag === "string")
        .map(revalidateTag),
    );
  };

  return (
    <html lang={locale} className="scroll-smooth">
      <body
        className={`${inter.className} flex min-h-screen flex-col antialiased`}
      >
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        {isEnabled && (
          <>
            <VisualEditing refresh={visualEditingRefresh} />
            <PreviewBar />
          </>
        )}
        <SanityLive />
      </body>
    </html>
  );
}
