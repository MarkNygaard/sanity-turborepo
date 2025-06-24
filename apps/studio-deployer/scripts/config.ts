import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  token: process.env.SANITY_TOKEN!,
  useCdn: false,
  apiVersion: "2025-03-01",
});

export interface Market {
  _id: string;
  code: string;
  title: string;
  flag?: string;
  flagCode?: string;
  languages: Array<{
    code: string;
    title: string;
    _id: string;
    isDefault?: boolean;
  }>;
}

export const STUDIO_CONFIG = {
  baseHostname: "dilling",
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  basePath: "../studio", // Path to your studio code
};
