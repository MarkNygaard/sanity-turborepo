import { assist } from '@sanity/assist'
import { visionTool } from '@sanity/vision'
import { defineConfig, PluginOptions } from 'sanity'
import { structureTool } from 'sanity/structure'
import { bookmarkInspector } from './components/inspectors/bookmarkInspector'
import { dataset, projectId } from './lib/api'
import {
  dynamicDocumentInternationalisationConfig,
  fieldLevelInternationalisationConfig,
} from './plugins/internationalisation'
import { schemaTypes } from './schemaTypes'
import { templates } from './schemaTypes/templates'
import { customStructure } from './structure'

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

// Static configuration for typegen - no async operations
export default defineConfig({
  name: 'default',
  title: 'DILLING',
  projectId,
  dataset,
  basePath: '/dilling',
  ...minimalConfigOptions,
  plugins: [
    structureTool({
      structure: (S, context) => customStructure(S, context, null),
    }),
    visionTool(),
    dynamicDocumentInternationalisationConfig,
    fieldLevelInternationalisationConfig,
    assist({
      translate: {
        document: {
          languageField: 'language',
          documentTypes: ['page', 'homePage'],
        },
        field: {
          languages: async (client) => {
            const response = await client.fetch(`*[_type == "language"]{ id, title }`)
            return response
          },
        },
      },
    }),
  ],
})
