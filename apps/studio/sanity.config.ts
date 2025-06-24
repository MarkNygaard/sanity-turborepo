import { assist } from '@sanity/assist'
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { documentInternationalization } from '@sanity/document-internationalization'
import { internationalizedArray } from 'sanity-plugin-internationalized-array'

// Import flag icons CSS
import './styles/globals.css'

import { bookmarkInspector } from './components/inspectors/bookmarkInspector'
import { marketsManagementTool } from './components/tools/marketsManagement'
import { personalDashboardTool } from './components/tools/personalDashboardWrapper'
import { createFlagWorkspaceIcon } from './components/FlagIcon'
import { dataset, projectId } from './lib/api'
import { createMarketPlugins } from './plugins/presentationConfig'
import { schemaTypes } from './schemaTypes'
import { templates } from './schemaTypes/templates'
import { customStructure } from './structure'
import { createMarketStructure } from './structure/createMarketStrucure'
import { fetchLanguagesMarketsAndPerson } from './utils/fetchLanguagesMarketsAndPerson'

// Schema types that need internationalization
const i18nSchemaTypes = ['page', 'homePage', 'settings', 'navigation', 'footer']

// Shared configuration options
const minimalConfigOptions = {
  schema: {
    types: schemaTypes,
    templates: templates,
  },
  document: {
    inspectors: (prev: any, context: any) => {
      return [...prev, bookmarkInspector]
    },
  },
  beta: {
    create: {
      startInCreateEnabled: false,
    },
  },
}

// Plugin factory for different workspace types
function createPlugins(marketData?: any, isGlobal = false) {
  const plugins = [visionTool()]

  // Add structure tool with appropriate structure
  if (isGlobal) {
    plugins.unshift(
      structureTool({
        structure: async (S, context) => {
          try {
            const languagesMarketsAndPerson = await fetchLanguagesMarketsAndPerson()
            if (languagesMarketsAndPerson?.person) {
              return customStructure(S, context, languagesMarketsAndPerson.person)
            }
          } catch (error) {
            console.warn('Could not load person data for structure:', error)
          }
          return customStructure(S, context, null)
        },
      }),
    )
  } else if (marketData) {
    plugins.unshift(
      structureTool({
        structure: (S, context) => createMarketStructure(marketData, S, context),
      }),
    )

    // Add presentation tool and related plugins for market workspaces
    plugins.push(...createMarketPlugins(marketData))
  }

  // Add internationalization plugins
  if (marketData?.languages) {
    // Field-level internationalization
    plugins.push(
      internationalizedArray({
        languages: marketData.languages.map((lang: any) => ({
          id: lang.code,
          title: lang.title,
        })),
        fieldTypes: ['string'],
      }),
    )

    // Document-level internationalization (only if multiple languages)
    if (marketData.languages.length > 1) {
      plugins.push(
        documentInternationalization({
          supportedLanguages: marketData.languages.map((lang: any) => ({
            id: lang.code,
            title: lang.title,
          })),
          schemaTypes: i18nSchemaTypes,
        }),
      )
    }

    // Sanity Assist for translation
    plugins.push(
      assist({
        translate: {
          document: {
            languageField: 'language',
            documentTypes: ['page', 'homePage'],
          },
          field: {
            languages: marketData.languages.map((lang: any) => ({
              id: lang.code,
              title: lang.title,
            })),
          },
        },
      }),
    )
  } else if (isGlobal) {
    // For global workspace, load languages dynamically
    plugins.push(
      internationalizedArray({
        languages: async (client) => {
          try {
            const languages = await client.fetch(`*[_type == "language"]{ "id": code, title }`)
            return languages || []
          } catch (error) {
            return []
          }
        },
        fieldTypes: ['string'],
      }),
    )

    plugins.push(
      documentInternationalization({
        supportedLanguages: async (client) => {
          try {
            const languages = await client.fetch(`*[_type == "language"]{ "id": code, title }`)
            return languages || []
          } catch (error) {
            return []
          }
        },
        schemaTypes: i18nSchemaTypes,
      }),
    )

    plugins.push(
      assist({
        translate: {
          document: {
            languageField: 'language',
            documentTypes: ['page', 'homePage'],
          },
          field: {
            languages: async (client) => {
              try {
                const languages = await client.fetch(`*[_type == "language"]{ "id": code, title }`)
                return languages || []
              } catch (error) {
                return []
              }
            },
          },
        },
      }),
    )
  }

  return plugins
}

// Create workspace configurations
async function createWorkspaceConfigs() {
  try {
    console.log('🔄 Loading market configuration for workspaces...')

    // Fetch your dynamic market data
    const languagesMarketsAndPerson = await fetchLanguagesMarketsAndPerson()

    if (!languagesMarketsAndPerson?.markets) {
      console.warn('⚠️ No markets found, creating fallback workspace')
      return createFallbackWorkspace()
    }

    console.log(`✅ Found ${languagesMarketsAndPerson.markets.length} markets`)

    const workspaces = []

    // Create global workspace (with management tools)
    const globalWorkspace = {
      name: 'global',
      title: 'DILLING - Global',
      icon: createFlagWorkspaceIcon('EU'), // Use EU flag for global or a globe icon
      projectId,
      dataset,
      basePath: '/global',
      ...minimalConfigOptions,
      plugins: createPlugins(undefined, true),
      tools: (prev: any) => [...prev, marketsManagementTool, personalDashboardTool],
    }
    workspaces.push(globalWorkspace)

    // Create market-specific workspaces using flag icons
    for (const market of languagesMarketsAndPerson.markets) {
      const flagCode = market.flag || market.code || 'EU' // Use flag, fallback to code, then EU
      const marketWorkspace = {
        name: market.code.toLowerCase(),
        title: `DILLING - ${market.title}`,
        icon: createFlagWorkspaceIcon(flagCode),
        projectId,
        dataset,
        basePath: `/${market.code.toLowerCase()}`,
        ...minimalConfigOptions,
        plugins: createPlugins(market, false),
        // No tools in market workspaces to keep them focused
        tools: (prev: any) => prev,
      }
      workspaces.push(marketWorkspace)
    }

    console.log(`✅ Created ${workspaces.length} workspaces with flag icons`)

    return workspaces
  } catch (error) {
    console.error('❌ Error creating workspace configs:', error)
    return createFallbackWorkspace()
  }
}

// Fallback workspace if dynamic loading fails
function createFallbackWorkspace() {
  console.log('🔄 Creating fallback workspace')

  return [
    {
      name: 'fallback',
      title: 'DILLING',
      icon: createFlagWorkspaceIcon('EU'),
      projectId,
      dataset,
      basePath: '/studio',
      ...minimalConfigOptions,
      plugins: createPlugins(undefined, true),
      tools: (prev: any) => [...prev, marketsManagementTool, personalDashboardTool],
    },
  ]
}

// Export the configuration
export default defineConfig(await createWorkspaceConfigs())
