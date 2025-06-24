import { useDocuments } from "@sanity/sdk-react";

import type { Market } from "../types/Market";

export function useMarkets() {
  const {
    data: markets = [],
    isPending,
    error,
  } = useDocuments<Market>({
    filter: `_type == "market"`,
    orderBy: "title asc",
  });

  const marketsByCode = markets.reduce(
    (acc, market) => {
      acc[market.code.toLowerCase()] = market;
      return acc;
    },
    {} as Record<string, Market>,
  );

  const totalLanguages = markets.reduce((total, market) => {
    return total + market.languages.length;
  }, 0);

  return {
    markets,
    marketsByCode,
    totalMarkets: markets.length,
    totalLanguages,
    isPending,
    error,
    // Helper functions
    getMarketByCode: (code: string) => marketsByCode[code.toLowerCase()],
    hasMarkets: markets.length > 0,
  };
}
