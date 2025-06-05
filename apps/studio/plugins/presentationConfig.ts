import { presentationTool } from 'sanity/presentation'
import { Market } from '../utils/fetchLanguagesMarketsAndPerson'
import { presentationUrl } from './presentationUrl'

export function createPresentationToolConfig(market: Market) {
  // Get the default language for this market
  const defaultLanguage =
    market.languages.find((lang) => lang.isDefault)?.code || market.languages[0]?.code

  return presentationTool({
    previewUrl: {
      origin: 'http://localhost:3000',
      preview: `/${defaultLanguage}`,
      previewMode: {
        enable: '/api/draft-mode/enable',
        disable: '/api/draft-mode/disable',
      },
      draftMode: {
        enable: '/api/draft-mode/enable',
        disable: '/api/draft-mode/disable',
      },
    },
  })
}

export function createMarketPlugins(market: Market) {
  return [createPresentationToolConfig(market), presentationUrl()]
}
