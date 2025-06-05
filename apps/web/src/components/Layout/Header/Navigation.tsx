"use client";

import type {
  Navigation,
  NavigationDropdown,
  NavigationLink,
  Settings,
} from "types/sanity";
import Link from "next/link";
import Container from "@/Primitives/Container";
// import SanityImage from "@/Primitives/SanityImage";
import { RiSearchLine } from "react-icons/ri";

import { cn } from "@repo/ui";

import CategoryPopover from "./CategoryPopover";
import { useSmartNav } from "./useSmartNav";

interface NavigationProps {
  navigation: Navigation | null;
  settings: Settings | null;
}

export default function Navigation({ navigation, settings }: NavigationProps) {
  const { scrollDirection, isSticky, scrollY } = useSmartNav();
  const menuItems = navigation?.navigationItems ?? [];

  const buildInternalUrl = (internalLink: NavigationLink["internalLink"]) => {
    if (
      !internalLink ||
      !("slug" in internalLink) ||
      typeof internalLink.slug !== "object" ||
      !internalLink.slug ||
      !("current" in internalLink.slug) ||
      !(
        typeof internalLink.slug.current === "string" &&
        internalLink.slug.current
      )
    )
      return "/";

    const language = navigation?.language ?? "en";
    return `/${language}/${internalLink.slug.current}`;
  };

  const renderNavigationLink = (item: NavigationLink) => {
    const href =
      item.linkType === "internal"
        ? buildInternalUrl(item.internalLink)
        : (item.externalLink ?? "#");

    const target = item.openInNewTab ? "_blank" : undefined;
    const rel = item.openInNewTab ? "noopener noreferrer" : undefined;

    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        className={cn(
          "cursor-pointer px-3 font-semibold hover:text-gray-700",
          "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-black",
          "no-focus-ring",
        )}
      >
        <span className="border-b-2 border-transparent py-1 transition-all hover:border-black">
          {item.name}
        </span>
      </Link>
    );
  };

  return (
    <>
      <header
        className={cn(
          "z-50 w-full bg-white transition-all duration-100 ease-in-out",
          {
            "relative top-0": !isSticky && scrollY < 36,
            "relative top-[36px]": !isSticky && scrollY >= 96,
            "relative top-[-60px]": !isSticky && scrollY >= 96 && scrollY < 156,
            "fixed top-0 z-50": isSticky && scrollDirection === "up",
            "fixed top-[-60px] z-50": isSticky && scrollDirection === "down",
          },
        )}
      >
        <Container className="flex h-[60px] items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative -m-2 flex w-8 lg:ml-0">
            {settings?.logo?.asset ? (
              <div></div>
            ) : (
              // <SanityImage
              //   image={settings.logo}
              //   alt={settings.siteTitle || "DILLING"}
              //   className="object-contain"
              //   width={32}
              //   height={32}
              // />
              <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-200 text-xs font-bold">
                {(settings?.siteTitle ?? "DILLING").charAt(0)}
              </div>
            )}
          </Link>

          {/* Navigation */}
          <nav aria-label="Main Navigation">
            <ul className="hidden gap-1 md:flex">
              {menuItems.map((item, index) => {
                if (item._type === "navigationLink") {
                  const linkItem = item as NavigationLink;
                  return (
                    <li key={`${item._type}-${index}`}>
                      {renderNavigationLink(linkItem)}
                    </li>
                  );
                }

                // Directly handle the navigationDropdown case since the type is guaranteed
                const dropdownItem = item as NavigationDropdown;
                return (
                  <li
                    key={`${item._type}-${index}`}
                    className="flex items-center"
                  >
                    <CategoryPopover
                      category={{
                        label: dropdownItem.title || "",
                        columns: dropdownItem.columns.map((col) => ({
                          title: col.title,
                          links: col.links.map((link) => ({
                            name: link.name || "",
                            href:
                              link.linkType === "internal"
                                ? buildInternalUrl(link.internalLink)
                                : (link.externalLink ?? "#"),
                            target: link.openInNewTab ? "_blank" : undefined,
                          })),
                        })),
                      }}
                    />
                  </li>
                );

                return null;
              })}
            </ul>
          </nav>

          {/* Search */}
          <div className="relative">
            <div className="pointer-events-none inset-y-0 flex items-center lg:absolute lg:left-3 lg:text-gray-400">
              <RiSearchLine />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="hidden w-full rounded-full border border-gray-300 py-2 pl-8 pr-4 text-sm placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black lg:block"
            />
          </div>
        </Container>
      </header>
      {isSticky && <div className="h-[60px]" />}
    </>
  );
}
