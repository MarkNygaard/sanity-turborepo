import { TbHome, TbSettings } from 'react-icons/tb'
import { StructureBuilder, StructureResolverContext } from 'sanity/structure'
import { PagePreviewMedia } from '../components/previews/PagePreview'
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
      // Home Pages Section - showing all languages
      S.listItem()
        .title(`Home Pages`)
        .icon(TbHome)
        .child(
          S.list()
            .title(`${market.title} Home Pages`)
            .items(
              market.languages.map((language) => {
                const homePageId = `home-page-${market.code}-${language.code}`
                const isDefault = language.isDefault || false

                return S.listItem()
                  .title(`${language.title} Home Page${isDefault ? ' (Default)' : ''}`)
                  .id(`home-page-${market.code}-${language.code}`)
                  .icon(() => <PagePreviewMedia language={language.code} />)
                  .child(
                    S.editor()
                      .id(homePageId)
                      .schemaType('homePage')
                      .documentId(homePageId)
                      .title(`${market.title} Home Page (${language.title})`)
                      .views([S.view.form()])
                      .initialValueTemplate('market-home-page', {
                        language: language.code,
                        market: market.code,
                        marketTitle: market.title,
                      }),
                  )
              }),
            ),
        ),

      S.divider(),

      // Pages Section
      S.listItem()
        .title('Pages')
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

      // Site Settings Section - ADD THIS SECTION
      S.listItem()
        .title('Site Settings')
        .child(
          S.list()
            .title('Site Settings')
            .items([
              // Settings for each language
              S.listItem()
                .title('Settings')
                .icon(TbSettings)
                .child(
                  S.list()
                    .title(`${market.title} Settings`)
                    .items(
                      market.languages.map((language) => {
                        const settingsId = `settings-${market.code}-${language.code}`
                        const isDefault = language.isDefault || false

                        return S.listItem()
                          .title(`${language.title} Settings${isDefault ? ' (Default)' : ''}`)
                          .id(`settings-${market.code}-${language.code}`)
                          .icon(() => <PagePreviewMedia language={language.code} />)
                          .child(
                            S.editor()
                              .id(settingsId)
                              .schemaType('settings')
                              .documentId(settingsId)
                              .title(`${market.title} Settings (${language.title})`)
                              .views([S.view.form()])
                              .initialValueTemplate('market-settings', {
                                language: language.code,
                                market: market.code,
                                marketTitle: market.title,
                              }),
                          )
                      }),
                    ),
                ),
              S.divider(),
            ]),
        ),
    ])
}
