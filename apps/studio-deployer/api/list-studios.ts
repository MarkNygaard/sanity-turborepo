import { marketService } from "../src/services/marketService";

const STUDIO_CONFIG = {
  baseHostname: "dilling",
};

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Fetch markets to build expected studio list
    const markets = await marketService.fetchMarkets();

    const studios = [
      // Global studio
      {
        hostname: `${STUDIO_CONFIG.baseHostname}-global`,
        url: marketService.getGlobalStudioUrl(STUDIO_CONFIG.baseHostname),
        market: "global",
        type: "global",
      },
      // Market-specific studios
      ...markets.map((market) => ({
        hostname: marketService.getStudioHostname(
          market,
          STUDIO_CONFIG.baseHostname,
        ),
        url: marketService.getStudioUrl(market, STUDIO_CONFIG.baseHostname),
        market: market.code,
        type: "market",
        title: market.title,
        languages: market.languages.length,
      })),
    ];

    // Optionally check status of each studio (this could be slow)
    const withStatus = await Promise.all(
      studios.map(async (studio) => {
        try {
          const response = await fetch(studio.url, {
            method: "HEAD",
            signal: AbortSignal.timeout(3000),
          });
          return {
            ...studio,
            status: response.ok ? "active" : "inactive",
            lastChecked: new Date().toISOString(),
          };
        } catch {
          return {
            ...studio,
            status: "unknown",
            lastChecked: new Date().toISOString(),
          };
        }
      }),
    );

    res.status(200).json({
      studios: withStatus,
      total: withStatus.length,
      active: withStatus.filter((s) => s.status === "active").length,
      inactive: withStatus.filter((s) => s.status === "inactive").length,
      unknown: withStatus.filter((s) => s.status === "unknown").length,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to list studios:", error);
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to list studios",
      studios: [],
      total: 0,
    });
  }
}
