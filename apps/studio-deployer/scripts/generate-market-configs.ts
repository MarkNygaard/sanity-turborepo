import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

import { client, Market, STUDIO_CONFIG } from "./config.js";

async function fetchMarkets(): Promise<Market[]> {
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

  return await client.fetch(query);
}

function generateMarketConfig(market: Market): string {
  return `// Auto-generated config for ${market.title}
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { assist } from '@sanity/assist'
import { documentInternationalization } from '@sanity/document-internationalization'
import { internationalizedArray } from 'sanity-plugin-internationalized-array'

import { schemaTypes } from '../schemaTypes'
import { templates } from '../schemaTypes/templates'
import { createMarketStructure } from '../structure/createMarketStrucure'
import { bookmarkInspector } from '../components/inspectors/bookmarkInspector'
import { createFlagWorkspaceIcon } from '../components/FlagIcon'

// Market data for ${market.title}
const MARKET_DATA = ${JSON.stringify(market, null, 2)}

export default defineConfig({
  name: '${market.code.toLowerCase()}-market',
  title: 'DILLING - ${market.title}',
  icon: createFlagWorkspaceIcon('${market.flagCode || market.flag || market.code}'),
  
  projectId: '${STUDIO_CONFIG.projectId}',
  dataset: '${STUDIO_CONFIG.dataset}',
  
  plugins: [
    structureTool({
      structure: (S, context) => createMarketStructure(MARKET_DATA, S, context),
    }),
    visionTool(),
    documentInternationalization({
      supportedLanguages: ${JSON.stringify(
        market.languages.map((lang) => ({ id: lang.code, title: lang.title })),
        null,
        6,
      )},
      schemaTypes: ['page', 'homePage', 'settings', 'navigation', 'footer'],
    }),
    internationalizedArray({
      languages: ${JSON.stringify(
        market.languages.map((lang) => ({ id: lang.code, title: lang.title })),
        null,
        6,
      )},
      fieldTypes: ['string'],
    }),
    assist({
      translate: {
        document: {
          languageField: 'language',
          documentTypes: ['page', 'homePage'],
        },
        field: {
          languages: ${JSON.stringify(
            market.languages.map((lang) => ({
              id: lang.code,
              title: lang.title,
            })),
            null,
            10,
          )},
        },
      },
    }),
  ],
  
  schema: {
    types: schemaTypes,
    templates: templates,
  },
  
  document: {
    inspectors: (prev, context) => {
      return [...prev, bookmarkInspector]
    },
  },
  
  beta: {
    create: {
      startInCreateEnabled: false,
    },
  },
})`;
}

function generateGlobalConfig(markets: Market[]): string {
  const allLanguages = Array.from(
    new Map(
      markets.flatMap((m) => m.languages).map((lang) => [lang.code, lang]),
    ).values(),
  );

  return `// Auto-generated global config
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { assist } from '@sanity/assist'

import { schemaTypes } from '../schemaTypes'
import { templates } from '../schemaTypes/templates'
import { customStructure } from '../structure'
import { bookmarkInspector } from '../components/inspectors/bookmarkInspector'
import { marketsManagementTool } from '../components/tools/marketsManagement'
import { personalDashboardTool } from '../components/tools/personalDashboardWrapper'
import { createFlagWorkspaceIcon } from '../components/FlagIcon'

export default defineConfig({
  name: 'global-management',
  title: 'DILLING - Global Management',
  icon: createFlagWorkspaceIcon('EU'),
  
  projectId: '${STUDIO_CONFIG.projectId}',
  dataset: '${STUDIO_CONFIG.dataset}',
  
  plugins: [
    structureTool({
      structure: customStructure,
    }),
    visionTool(),
    assist({
      translate: {
        document: {
          languageField: 'language',
          documentTypes: ['page', 'homePage'],
        },
        field: {
          languages: ${JSON.stringify(
            allLanguages.map((lang) => ({ id: lang.code, title: lang.title })),
            null,
            10,
          )},
        },
      },
    }),
  ],
  
  tools: (prev) => [...prev, marketsManagementTool, personalDashboardTool],
  
  schema: {
    types: schemaTypes,
    templates: templates,
  },
  
  document: {
    inspectors: (prev, context) => {
      return [...prev, bookmarkInspector]
    },
  },
  
  beta: {
    create: {
      startInCreateEnabled: false,
    },
  },
})`;
}

export async function generateAllMarketConfigs() {
  console.log("🔄 Fetching markets from Sanity...");
  const markets = await fetchMarkets();

  if (!markets.length) {
    throw new Error("No markets found in dataset");
  }

  console.log(`✅ Found ${markets.length} markets`);

  // Create configs directory
  const configsDir = join(process.cwd(), "..", "studio", "configs");
  mkdirSync(configsDir, { recursive: true });

  // Generate config for each market
  for (const market of markets) {
    const configContent = generateMarketConfig(market);
    const configPath = join(
      configsDir,
      `sanity.config.${market.code.toLowerCase()}.ts`,
    );

    writeFileSync(configPath, configContent, "utf8");
    console.log(`✅ Generated config for ${market.title}: ${configPath}`);
  }

  // Generate global config
  const globalConfig = generateGlobalConfig(markets);
  const globalConfigPath = join(configsDir, "sanity.config.global.ts");
  writeFileSync(globalConfigPath, globalConfig, "utf8");
  console.log(`✅ Generated global config: ${globalConfigPath}`);

  return markets;
}
