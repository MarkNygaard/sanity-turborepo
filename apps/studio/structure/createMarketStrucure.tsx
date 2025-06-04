// apps/studio/structure/createMarketStrucure.tsx
import { TbHome } from 'react-icons/tb'
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

  // Create home page document ID for this market
  const homePageId = `home-page-${market.code}-${defaultLanguage.code}`

  return S.list()
    .title(`${market.title} specific Content`)
    .items([
      // Home Page Section
      S.listItem()
        .title(`Home Page`)
        .icon(TbHome)
        .child(
          S.editor()
            .id(homePageId)
            .schemaType('homePage')
            .documentId(homePageId)
            .title(`${market.title} Home Page`)
            .views([S.view.form()]),
        ),

      S.divider(),

      // Pages Section
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

      // Site Settings Section
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
