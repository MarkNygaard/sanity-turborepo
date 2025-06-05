import { EarthGlobeIcon } from '@sanity/icons'
import groq from 'groq'
import { map } from 'rxjs'
import { StructureBuilder, StructureResolverContext } from 'sanity/structure'
import { PagePreviewMedia } from '../components/previews/PagePreview'
import { apiVersion } from '../lib/api'

export const internationalisedPagesStructure = async (
  S: StructureBuilder,
  context: StructureResolverContext,
) => {
  const documentStore = context.documentStore

  const languagePages = documentStore
    .listenQuery(
      groq`{
        "markets": *[_type == "market"]|order(title asc) {
          _id,
          title,
          code,
          "languages": languages[]->{code, title, _id, isDefault}
        }
      }`,
      {},
      {
        tag: 'language-based-pages-list',
      },
    )
    .pipe(
      map((data) => {
        if (!data || !data.markets || !Array.isArray(data.markets)) {
          return S.list()
            .title('Internationalised Pages')
            .items([
              S.listItem()
                .title('No markets found')
                .id('no-markets-pages')
                .child(S.documentList().title('No Markets').filter('_type == "market"')),
            ])
        }

        const allPageCombinations = []

        for (const market of data.markets) {
          if (!market.languages || !Array.isArray(market.languages)) {
            continue
          }

          for (const language of market.languages) {
            const isDefault = language.isDefault === true

            allPageCombinations.push({
              market,
              language,
              isDefault,
            })
          }
        }

        return S.list()
          .title('Internationalised Pages')
          .items(
            allPageCombinations.map(({ market, language, isDefault }) => {
              return S.listItem()
                .title(`${market.title} - ${language.title} Pages${isDefault ? ' (Default)' : ''}`)
                .id(`pages-list-${market.code}-${language.code}`)
                .icon(() => <PagePreviewMedia language={language.code} />)
                .child(
                  S.documentTypeList('page')
                    .title(`${market.title} - ${language.title} Pages`)
                    .filter(
                      `_type == "page" && language == "${language.code}" && market == "${market.code}"`,
                    )
                    .apiVersion(apiVersion)
                    .canHandleIntent(
                      S.documentTypeList('page')
                        .filter(
                          `_type == "page" && language == "${language.code}" && market == "${market.code}"`,
                        )
                        .apiVersion(apiVersion)
                        .getCanHandleIntent(),
                    )
                    .initialValueTemplates([
                      S.initialValueTemplateItem('internationalised-page', {
                        language: language.code,
                        market: market.code,
                        marketTitle: market.title,
                      }),
                    ]),
                )
            }),
          )
      }),
    )

  return S.listItem()
    .title('Internationalised Pages')
    .id('internationalised-pages-list')
    .icon(EarthGlobeIcon)
    .child(() => languagePages)
}
