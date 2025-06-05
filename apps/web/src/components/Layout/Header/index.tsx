import type { Locale } from "next-intl";
import type { Navigation, Settings } from "types/sanity";
import { NAVIGATION_QUERY, SETTINGS_QUERY } from "lib/sanity/query";

import { sanityFetch } from "@repo/sanity";

import NavigationComponent from "./Navigation";

// import TopBar from "./TopBar";

interface HeaderProps {
  language: Promise<Locale>;
  market: string;
}

const Header = async ({ language, market }: HeaderProps) => {
  // Fetch navigation and settings data from Sanity with proper typing
  const [navigationData, settingsData] = await Promise.all([
    sanityFetch({
      query: NAVIGATION_QUERY,
      params: { language, market },
    }) as Promise<{ data: Navigation | null }>,
    sanityFetch({
      query: SETTINGS_QUERY,
      params: { language, market },
    }) as Promise<{ data: Settings | null }>,
  ]);

  return (
    <>
      {/* <TopBar /> */}
      <NavigationComponent
        navigation={navigationData.data}
        settings={settingsData.data}
      />
    </>
  );
};

export default Header;
