import { TbMenu2 } from 'react-icons/tb'
import groq from 'groq'
import { map } from 'rxjs'
import { StructureBuilder, StructureResolverContext } from 'sanity/structure'
import { PagePreviewMedia } from '../components/previews/PagePreview'
import { apiVersion } from '../lib/api'

export const internationalisedNavigationStructure = async (
  S: StructureBuilder,
  context: StructureResolverContext,
) => {
  const documentStore = context.documentStore

  return S.listItem()
    .title('Navigation')
    .id('internationalized-navigation-list')
    .icon(TbMenu2)
    .child(() => {
      return documentStore
        .listenQuery(
          groq`{
            "markets": *[_type == "market"]|order(title asc) {
              _id,
              title,
              code,
              "languages": languages[]->{code, title, _id, isDefault}
            },
            "navigations": *[_type == "navigation"] {
              _id,
              label,
              language,
              market
            }
          }`,
          {},
          {
            tag: 'market-navigation-list',
            apiVersion,
          },
        )
        .pipe(
          map((data) => {
            // Ensure we have data
            if (!data || !data.markets || !Array.isArray(data.markets)) {
              return S.list()
                .title('Navigation')
                .items([
                  S.listItem()
                    .title('No markets found')
                    .id('no-markets-navigation')
                    .child(S.documentList().title('No Markets').filter('_type == "market"')),
                ])
            }

            // Create a flat list of all market-language combinations
            const allNavigationCombinations = []

            for (const market of data.markets) {
              if (!market.languages || !Array.isArray(market.languages)) {
                continue
              }

              for (const language of market.languages) {
                const navigationId = `navigation-${market.code}-${language.code}`
                const isDefault = language.isDefault === true

                allNavigationCombinations.push({
                  market,
                  language,
                  navigationId,
                  isDefault,
                })
              }
            }

            if (allNavigationCombinations.length === 0) {
              return S.list()
                .title('Navigation')
                .items([
                  S.listItem()
                    .title('No combinations found')
                    .id('no-combinations-navigation')
                    .child(S.documentList().title('Debug').filter('_type == "market"')),
                ])
            }

            // Sort combinations: market name first, then default languages first, then alphabetical
            allNavigationCombinations.sort((a, b) => {
              if (a.market.title !== b.market.title) {
                return a.market.title.localeCompare(b.market.title)
              }
              if (a.isDefault !== b.isDefault) {
                return b.isDefault ? 1 : -1
              }
              return a.language.title.localeCompare(b.language.title)
            })

            const items = allNavigationCombinations.map(
              ({ market, language, navigationId, isDefault }) => {
                // Check if this navigation actually exists
                const navigationExists =
                  data.navigations && data.navigations.some((nav: any) => nav._id === navigationId)

                const title = `${market.title} - ${language.title}${isDefault ? ' (Default)' : ''}`
                const displayTitle = navigationExists ? `✅ ${title}` : `❌ ${title}`

                return S.listItem()
                  .title(displayTitle)
                  .id(`navigation-${market.code}-${language.code}-item`)
                  .icon(() => <PagePreviewMedia language={language.code} />)
                  .child(
                    S.editor()
                      .id(navigationId)
                      .schemaType('navigation')
                      .documentId(navigationId)
                      .title(`${market.title} Navigation (${language.title})`)
                      .views([S.view.form()]),
                  )
              },
            )

            return S.list().title('Navigation').items(items)
          }),
        )
    })
}
