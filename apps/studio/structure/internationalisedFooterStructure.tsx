import { TbLayoutBottombar } from 'react-icons/tb'
import groq from 'groq'
import { map } from 'rxjs'
import { StructureBuilder, StructureResolverContext } from 'sanity/structure'
import { PagePreviewMedia } from '../components/previews/PagePreview'
import { apiVersion } from '../lib/api'

export const internationalisedFooterStructure = async (
  S: StructureBuilder,
  context: StructureResolverContext,
) => {
  const documentStore = context.documentStore

  return S.listItem()
    .title('Footer')
    .id('internationalized-footer-list')
    .icon(TbLayoutBottombar)
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
            "footers": *[_type == "footer"] {
              _id,
              label,
              language,
              market
            }
          }`,
          {},
          {
            tag: 'market-footer-list',
            apiVersion,
          },
        )
        .pipe(
          map((data) => {
            // Ensure we have data
            if (!data || !data.markets || !Array.isArray(data.markets)) {
              return S.list()
                .title('Footer')
                .items([
                  S.listItem()
                    .title('No markets found')
                    .id('no-markets-footer')
                    .child(S.documentList().title('No Markets').filter('_type == "market"')),
                ])
            }

            // Create a flat list of all market-language combinations
            const allFooterCombinations = []

            for (const market of data.markets) {
              if (!market.languages || !Array.isArray(market.languages)) {
                continue
              }

              for (const language of market.languages) {
                const footerId = `footer-${market.code}-${language.code}`
                const isDefault = language.isDefault === true

                allFooterCombinations.push({
                  market,
                  language,
                  footerId,
                  isDefault,
                })
              }
            }

            if (allFooterCombinations.length === 0) {
              return S.list()
                .title('Footer')
                .items([
                  S.listItem()
                    .title('No combinations found')
                    .id('no-combinations-footer')
                    .child(S.documentList().title('Debug').filter('_type == "market"')),
                ])
            }

            // Sort combinations: market name first, then default languages first, then alphabetical
            allFooterCombinations.sort((a, b) => {
              if (a.market.title !== b.market.title) {
                return a.market.title.localeCompare(b.market.title)
              }
              if (a.isDefault !== b.isDefault) {
                return b.isDefault ? 1 : -1
              }
              return a.language.title.localeCompare(b.language.title)
            })

            const items = allFooterCombinations.map(({ market, language, footerId, isDefault }) => {
              // Check if this footer actually exists
              const footerExists =
                data.footers && data.footers.some((footer: any) => footer._id === footerId)

              const title = `${market.title} - ${language.title}${isDefault ? ' (Default)' : ''}`
              const displayTitle = footerExists ? `✅ ${title}` : `❌ ${title}`

              return S.listItem()
                .title(displayTitle)
                .id(`footer-${market.code}-${language.code}-item`)
                .icon(() => <PagePreviewMedia language={language.code} />)
                .child(
                  S.editor()
                    .id(footerId)
                    .schemaType('footer')
                    .documentId(footerId)
                    .title(`${market.title} Footer (${language.title})`)
                    .views([S.view.form()]),
                )
            })

            return S.list().title('Footer').items(items)
          }),
        )
    })
}
