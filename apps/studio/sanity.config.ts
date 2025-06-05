import { assist } from '@sanity/assist'
import { visionTool } from '@sanity/vision'
import { Config, defineConfig, PluginOptions } from 'sanity'
import { structureTool } from 'sanity/structure'
import { bookmarkInspector } from './components/inspectors/bookmarkInspector'
import personalDashboard from './components/tools/personalDashboard'
import { dataset, projectId } from './lib/api'
import {
  dynamicDocumentInternationalisationConfigForMarkets,
  fieldLevelInternationalisationConfigLanguages,
} from './plugins/internationalisation'
import { schemaTypes } from './schemaTypes'
import { templates } from './schemaTypes/templates'
import { customStructure } from './structure'
import { createMarketWorkspace } from './utils/createMarketWorkspace'
import { fetchLanguagesMarketsAndPerson } from './utils/fetchLanguagesMarketsAndPerson'

const minimalConfigOptions: Omit<PluginOptions, 'name'> = {
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
}

const defaultWorkspace = {
  name: 'default',
  title: 'DILLING',
  projectId,
  dataset,
  basePath: '/dilling',
  ...minimalConfigOptions,
}

async function getConfigBasedOnMarkets(): Promise<Config> {
  const languagesMarketsAndPerson = await fetchLanguagesMarketsAndPerson()

  if (!languagesMarketsAndPerson) {
    return [
      {
        ...defaultWorkspace,
        plugins: [
          structureTool({
            structure: (S, context) => customStructure(S, context, null),
          }),
          visionTool(),
          // Add your fallback plugins here
        ],
      },
    ]
  }

  // Create market workspaces using the factory function
  const marketWorkspaces = languagesMarketsAndPerson.markets.map((market) =>
    createMarketWorkspace({
      market,
      projectId,
      dataset,
      minimalConfigOptions,
    }),
  )

  return [
    {
      ...defaultWorkspace,
      plugins: [
        structureTool({
          structure: (S, context) => customStructure(S, context, languagesMarketsAndPerson.person),
        }),
        visionTool(),
        dynamicDocumentInternationalisationConfigForMarkets(languagesMarketsAndPerson.languages),
        fieldLevelInternationalisationConfigLanguages(languagesMarketsAndPerson.languages),
        assist({
          translate: {
            document: {
              languageField: 'language',
              documentTypes: ['page', 'homePage'],
            },
            field: {
              languages: languagesMarketsAndPerson.languages.map((lang) => ({
                id: lang.code,
                title: lang.title,
              })),
            },
          },
        }),
      ],
      tools: (prev, context) => [...prev, personalDashboard(languagesMarketsAndPerson, context)],
    },
    ...marketWorkspaces,
  ]
}

const config = await getConfigBasedOnMarkets()

export default defineConfig(config)
