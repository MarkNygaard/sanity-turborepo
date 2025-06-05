import type { Locale } from "next-intl";
import type {
  Footer as FooterType,
  LANGUAGES_QUERYResult,
  Market,
  Settings,
} from "types/sanity";
import React from "react";
import Link from "next/link";
import Container from "@/Primitives/Container";
import SanityImage from "@/Primitives/SanityImage";
import { FOOTER_QUERY, MARKETS_QUERY, SETTINGS_QUERY } from "lib/sanity/query";

import { sanityFetch } from "@repo/sanity";

import LanguageSelector from "./LanguageSelector";

interface FooterProps {
  language: Promise<Locale>;
  languages: LANGUAGES_QUERYResult;
}

export default async function Footer({ language, languages }: FooterProps) {
  // Fetch footer data, settings, and market data in parallel
  const [footerData, settingsData] = await Promise.all([
    sanityFetch({
      query: FOOTER_QUERY,
      params: { language },
    }) as Promise<{ data: FooterType | null }>,
    sanityFetch({
      query: SETTINGS_QUERY,
      params: { language },
    }) as Promise<{ data: Settings | null }>,
  ]);

  if (!footerData.data) {
    return null;
  }

  const marketsData = (await sanityFetch({
    query: MARKETS_QUERY,
    params: { code: footerData.data.market },
  })) as { data: Market[] };

  const availableLanguages = marketsData.data[0]?.languages ?? languages;

  // Helper function to render links based on type
  const renderLink = (
    link: NonNullable<FooterType["columns"]>[0]["links"][0],
  ) => {
    if (link.linkType === "internal" && link.internalLink) {
      return (
        <Link
          key={link.name}
          href={`/${link.internalLink.slug.current}`}
          className="text-sm text-gray-600 transition-colors hover:text-gray-900"
          target={link.openInNewTab ? "_blank" : undefined}
          rel={link.openInNewTab ? "noopener noreferrer" : undefined}
        >
          {link.name}
        </Link>
      );
    }

    if (link.linkType === "external" && link.externalLink) {
      return (
        <a
          key={link.name}
          href={link.externalLink}
          className="text-sm text-gray-600 transition-colors hover:text-gray-900"
          target={link.openInNewTab ? "_blank" : "_self"}
          rel={link.openInNewTab ? "noopener noreferrer" : undefined}
        >
          {link.name}
        </a>
      );
    }

    return null;
  };

  return (
    <Container className="pt-12">
      <footer className="border-t border-gray-200">
        <div className="flex w-full flex-wrap gap-6">
          <div className="w-fit">
            {/* Footer Logo and Subtitle */}
            {(footerData.data.logo ?? footerData.data.subtitle) && (
              <div className="mb-8 mt-8">
                {footerData.data.logo?.asset && (
                  <div className="mb-4">
                    <SanityImage
                      image={footerData.data.logo}
                      alt={settingsData.data?.siteTitle ?? "DILLING"}
                      width={140}
                      height={28}
                    />
                  </div>
                )}
                {footerData.data.subtitle && (
                  <p className="max-w-md text-sm text-gray-600">
                    {footerData.data.subtitle}
                  </p>
                )}
              </div>
            )}

            {/* Footer Columns */}
            {footerData.data.columns.map((column, index) => (
              <div key={index} className="mt-12 min-w-[150px] flex-1">
                <h3 className="mb-4 text-sm font-semibold text-gray-900">
                  {column.title}
                </h3>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>{renderLink(link)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Language Selector - only show if there are multiple languages available in the current market */}
          {availableLanguages.length > 1 && (
            <div className="mt-12 flex min-w-[150px] flex-1 justify-end">
              <LanguageSelector
                availableLanguages={availableLanguages as LANGUAGES_QUERYResult}
              />
            </div>
          )}
        </div>

        {/* Copyright Text */}
        <div className="my-12 text-sm text-gray-500">
          © {new Date().getFullYear()} {footerData.data.copyrightText}
        </div>
      </footer>
    </Container>
  );
}
