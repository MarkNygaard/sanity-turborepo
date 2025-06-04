import { StructureBuilder, StructureResolverContext } from 'sanity/structure'
import { apiVersion } from '../lib/api'
import { Market } from '../utils/fetchLanguagesMarketsAndPerson'

export function createMarketStructure(
  market: Market,
  S: StructureBuilder,
  context: StructureResolverContext,
) {
  // Find the default language for this market
  const defaultLanguage = market.languages.find((lang) => lang.isDefault) || market.languages[0]

  return S.list()
    .title(`${market.title} specific Content`)
    .items([
      S.listItem()
        .title(`Pages for ${market.title} (${defaultLanguage.title})`)
        .child(
          S.documentTypeList('page')
            .title(`Pages (${defaultLanguage.title})`)
            .filter('_type == "page" && language == $defaultLanguage')
            .params({ defaultLanguage: defaultLanguage.code })
            .apiVersion(apiVersion)
            .initialValueTemplates([
              S.initialValueTemplateItem('internationalised-page', {
                language: defaultLanguage.code,
              }),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Site Settings')
        .child(
          S.list()
            .title('Site Settings')
            .items([
              S.documentTypeListItem('language').title('Languages'),
              S.documentTypeListItem('market').title('Markets'),
              S.documentTypeListItem('translation.metadata').title('Translation Metadata'),
              S.divider(),
            ]),
        ),
    ])
}
