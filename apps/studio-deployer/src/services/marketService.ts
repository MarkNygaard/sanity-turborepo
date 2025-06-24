import { createClient } from "@sanity/client";

import type { Language, Market } from "../types";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  useCdn: false,
  apiVersion: "2025-03-01",
});

class MarketService {
  async fetchMarkets(): Promise<Market[]> {
    const query = `*[_type == "market" && !(_id in path("drafts.**"))]|order(title asc) {
      _id,
      title,
      code,
      flag,
      flagCode,
      "languages": languages[]->{
        code,
        title,
        _id,
        isDefault
      }
    }`;

    return client.fetch(query);
  }

  async fetchLanguages(): Promise<Language[]> {
    const query = `*[_type == "language" && !(_id in path("drafts.**"))]|order(title asc) {
      _id,
      code,
      title,
      isDefault
    }`;

    return client.fetch(query);
  }

  async validateMarketConfiguration(): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const markets = await this.fetchMarkets();
    const languages = await this.fetchLanguages();

    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if we have markets
    if (markets.length === 0) {
      errors.push("No markets found in the dataset");
    }

    // Check if we have languages
    if (languages.length === 0) {
      errors.push("No languages found in the dataset");
    }

    // Validate each market
    for (const market of markets) {
      // Check market code
      if (!market.code || market.code.trim() === "") {
        errors.push(`Market "${market.title}" is missing a code`);
      }

      // Check if market has languages
      if (!market.languages || market.languages.length === 0) {
        warnings.push(`Market "${market.title}" has no languages assigned`);
      }

      // Check for duplicate market codes
      const duplicateMarkets = markets.filter(
        (m) =>
          m.code &&
          market.code &&
          m.code.toLowerCase() === market.code.toLowerCase() &&
          m._id !== market._id,
      );
      if (duplicateMarkets.length > 0) {
        errors.push(`Duplicate market code "${market.code}" found`);
      }
    }

    // Check for orphaned languages (languages not assigned to any market)
    const assignedLanguageIds = new Set(
      markets.flatMap((m) => m.languages?.map((l) => l._id) || []),
    );
    const orphanedLanguages = languages.filter(
      (l) => !assignedLanguageIds.has(l._id),
    );

    if (orphanedLanguages.length > 0) {
      warnings.push(
        `${orphanedLanguages.length} language(s) not assigned to any market: ${orphanedLanguages
          .map((l) => l.title)
          .join(", ")}`,
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  async getMarketStats(): Promise<{
    totalMarkets: number;
    totalLanguages: number;
    averageLanguagesPerMarket: number;
    marketsWithoutLanguages: number;
  }> {
    const markets = await this.fetchMarkets();
    const languages = await this.fetchLanguages();

    const marketsWithoutLanguages = markets.filter(
      (m) => !m.languages || m.languages.length === 0,
    ).length;

    const totalLanguageAssignments = markets.reduce(
      (sum, market) => sum + (market.languages?.length || 0),
      0,
    );

    return {
      totalMarkets: markets.length,
      totalLanguages: languages.length,
      averageLanguagesPerMarket:
        markets.length > 0
          ? Number((totalLanguageAssignments / markets.length).toFixed(1))
          : 0,
      marketsWithoutLanguages,
    };
  }

  // Helper function to generate studio hostname for a market
  getStudioHostname(market: Market, baseHostname = "dilling"): string {
    return `${baseHostname}-${market.code.toLowerCase()}`;
  }

  // Helper function to generate studio URL for a market
  getStudioUrl(market: Market, baseHostname = "dilling"): string {
    return `https://${this.getStudioHostname(market, baseHostname)}.sanity.studio`;
  }

  // Helper function to get global studio URL
  getGlobalStudioUrl(baseHostname = "dilling"): string {
    return `https://${baseHostname}-global.sanity.studio`;
  }
}

export const marketService = new MarketService();
