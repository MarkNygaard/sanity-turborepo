import { ConfigContext, Template, TemplateResolver } from 'sanity'

export const templates: TemplateResolver = (prev: Template<any, any>[], context: ConfigContext) => [
  ...prev,
  {
    id: 'internationalised-page',
    title: 'Internationalised Page',
    schemaType: 'page',
    parameters: [{ name: 'language', type: 'string' }],
    value: (params: { language: string }) => {
      return {
        language: params.language,
      }
    },
  },
  {
    id: 'market-home-page',
    title: 'Market Home Page',
    schemaType: 'homePage',
    parameters: [
      { name: 'language', type: 'string' },
      { name: 'market', type: 'string' },
      { name: 'marketTitle', type: 'string' },
    ],
    value: (params: { language: string; market: string; marketTitle: string }) => {
      return {
        title: `${params.marketTitle} Home Page`,
        language: params.language,
        market: params.market,
      }
    },
  },
]
