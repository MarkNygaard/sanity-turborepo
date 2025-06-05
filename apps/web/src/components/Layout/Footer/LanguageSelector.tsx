"use client";

import type { Locale } from "next-intl";
import type { LANGUAGES_QUERYResult } from "types/sanity";
import React, { useTransition } from "react";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "i18n/navigation";
import { getLangNameFromCode } from "language-name-map";
import { useLocale } from "next-intl";
import { FaCheck, FaChevronDown, FaGlobe, FaTimes } from "react-icons/fa";

import { Button } from "@repo/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@repo/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";

interface LanguageSelectorProps {
  availableLanguages: LANGUAGES_QUERYResult;
  currentMarket?: string;
}

export default function LanguageSelector({
  availableLanguages,
}: LanguageSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { slug } = params as { slug: string };
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  // Helper function to get the display name for a language
  const getLanguageDisplayName = (languageCode: string) => {
    // First try to find the language from language-name-map
    const langName = getLangNameFromCode(languageCode)?.name;
    if (langName) {
      return langName;
    }

    // Fallback to find the language in availableLanguages and use its title
    const language = availableLanguages.find(
      (lang) => lang.code === languageCode,
    );
    if (language?.title) {
      return language.title;
    }

    // Final fallback to uppercase code
    return languageCode.toUpperCase();
  };

  const handleLocaleChange = (nextLocale: Locale) => {
    // Ensure the target locale is available in the current market
    const isLocaleAvailable = availableLanguages.some(
      (lang) => lang.code === nextLocale,
    );

    if (!isLocaleAvailable) {
      console.warn(
        `Language ${nextLocale} is not available in the current market`,
      );
      return;
    }

    startTransition(() => {
      router.replace({ pathname, params: { slug } }, { locale: nextLocale });
    });
  };

  // Don't render if there's only one language available
  if (availableLanguages.length <= 1) {
    return null;
  }

  return (
    <>
      {/* Desktop Dropdown */}
      <div className="hidden sm:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="fullGhost"
              className="flex items-center gap-2 py-0 text-gray-500"
              disabled={isPending}
            >
              <FaGlobe className="h-4 w-4" />
              <span>{getLanguageDisplayName(locale)}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {availableLanguages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                className="flex cursor-pointer items-center justify-between"
                onClick={() => handleLocaleChange(lang.code)}
              >
                <span>{getLanguageDisplayName(lang.code)}</span>
                {lang.code === locale && <FaCheck className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Drawer */}
      <div className="sm:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <FaGlobe className="h-4 w-4" />
              <span>{getLanguageDisplayName(locale)}</span>
              <FaChevronDown className="h-3 w-3" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="grid gap-4 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Select Language</h3>
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <FaTimes className="h-4 w-4" />
                  </Button>
                </DrawerClose>
              </div>
              <div className="grid gap-2">
                {availableLanguages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant="ghost"
                    className="justify-start gap-2"
                    onClick={() => handleLocaleChange(lang.code)}
                    disabled={isPending}
                  >
                    <FaGlobe className="h-4 w-4" />
                    <span>{getLanguageDisplayName(lang.code)}</span>
                    {lang.code === locale && (
                      <FaCheck className="ml-auto h-4 w-4" />
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
