import { assist } from '@sanity/assist'
import { visionTool } from '@sanity/vision'
import { PluginOptions } from 'sanity'
import { structureTool } from 'sanity/structure'
import {
  dynamicDocumentInternationalisationConfigForMarkets,
  fieldLevelInternationalisationConfigForMarkets,
} from '../plugins/internationalisation'
import { createMarketPlugins } from '../plugins/presentationConfig'
import { createMarketStructure } from '../structure/createMarketStrucure'
import { Market } from './fetchLanguagesMarketsAndPerson'

interface CreateMarketWorkspaceOptions {
  market: Market
  projectId: string
  dataset: string
  minimalConfigOptions: Omit<PluginOptions, 'name'>
}

export function createMarketWorkspace({
  market,
  projectId,
  dataset,
  minimalConfigOptions,
}: CreateMarketWorkspaceOptions) {
  return {
    name: `market-${market.code}`,
    title: market.title,
    projectId,
    dataset,
    basePath: `/market-${market.code}`,
    plugins: [
      ...createMarketPlugins(market),
      structureTool({
        structure: (S, context) => createMarketStructure(market, S, context),
      }),
      visionTool(),
      dynamicDocumentInternationalisationConfigForMarkets(market.languages),
      fieldLevelInternationalisationConfigForMarkets(market.languages),
      assist({
        translate: {
          document: {
            languageField: 'language',
            documentTypes: ['page', 'homePage'],
          },
          field: {
            languages: market.languages.map((lang) => ({
              id: lang.code,
              title: lang.title,
            })),
          },
        },
      }),
    ],
    ...minimalConfigOptions,
  }
}
