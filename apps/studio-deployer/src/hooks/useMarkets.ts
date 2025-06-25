import { useQuery } from "@sanity/sdk-react";

import type { Market } from "../types/Market";

export function useMarkets() {
  const { data: markets = [], isPending } = useQuery<Market[]>({
    query: `*[_type == "market"]{
      _id,
      code,
      title,
      flag,
      flagCode,
      "languages": languages[]->{
        code,
        title,
        _id,
        isDefault
      }
    }`,
  });

  const marketsByCode = markets.reduce(
    (acc, market) => {
      if (market && typeof market.code === "string") {
        acc[market.code.toLowerCase()] = market;
      } else {
        console.warn("Market missing code:", market);
      }
      return acc;
    },
    {} as Record<string, Market>,
  );

  const totalLanguages = markets.reduce((total, market) => {
    return total + (market?.languages?.length || 0);
  }, 0);

  return {
    markets,
    marketsByCode,
    totalMarkets: markets.length,
    totalLanguages,
    isPending,
    getMarketByCode: (code: string) => marketsByCode[code.toLowerCase()],
    hasMarkets: markets.length > 0,
  };
}
