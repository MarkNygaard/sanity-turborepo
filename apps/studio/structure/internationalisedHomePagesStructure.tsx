import { TbHome } from 'react-icons/tb'
import groq from 'groq'
import { map } from 'rxjs'
import { StructureBuilder, StructureResolverContext } from 'sanity/structure'
import { PagePreviewMedia } from '../components/previews/PagePreview'
import { apiVersion } from '../lib/api'

export const internationalisedHomePagesStructure = async (
  S: StructureBuilder,
  context: StructureResolverContext,
) => {
  const documentStore = context.documentStore

  return S.listItem()
    .title('Home Pages')
    .id('internationalized-home-pages-list')
    .icon(TbHome)
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
            "homePages": *[_type == "homePage"] {
              _id,
              title,
              language,
              market
            }
          }`,
          {},
          {
            tag: 'market-home-pages-list',
            apiVersion,
          },
        )
        .pipe(
          map((data) => {
            // Ensure we have data
            if (!data || !data.markets || !Array.isArray(data.markets)) {
              return S.list()
                .title('Internationalized Home Pages')
                .items([
                  S.listItem()
                    .title('No markets found')
                    .id('no-markets')
                    .child(S.documentList().title('No Markets').filter('_type == "market"')),
                ])
            }

            // Create a flat list of all market-language combinations
            const allHomePageCombinations = []

            for (const market of data.markets) {
              if (!market.languages || !Array.isArray(market.languages)) {
                continue
              }

              for (const language of market.languages) {
                const homePageId = `home-page-${market.code}-${language.code}`
                const isDefault = language.isDefault === true

                allHomePageCombinations.push({
                  market,
                  language,
                  homePageId,
                  isDefault,
                })
              }
            }

            if (allHomePageCombinations.length === 0) {
              return S.list()
                .title('Internationalized Home Pages')
                .items([
                  S.listItem()
                    .title('No combinations found')
                    .id('no-combinations')
                    .child(S.documentList().title('Debug').filter('_type == "market"')),
                ])
            }

            // Sort combinations: market name first, then default languages first, then alphabetical
            allHomePageCombinations.sort((a, b) => {
              if (a.market.title !== b.market.title) {
                return a.market.title.localeCompare(b.market.title)
              }
              if (a.isDefault !== b.isDefault) {
                return b.isDefault ? 1 : -1
              }
              return a.language.title.localeCompare(b.language.title)
            })

            const items = allHomePageCombinations.map(
              ({ market, language, homePageId, isDefault }) => {
                // Check if this home page actually exists
                const homePageExists =
                  data.homePages && data.homePages.some((hp: any) => hp._id === homePageId)

                const title = `${market.title} - ${language.title}${isDefault ? ' (Default)' : ''}`
                const displayTitle = homePageExists ? `✅ ${title}` : `❌ ${title}`

                return S.listItem()
                  .title(displayTitle)
                  .id(`home-page-${market.code}-${language.code}-item`)
                  .icon(() => <PagePreviewMedia language={language.code} />)
                  .child(
                    S.editor()
                      .id(homePageId)
                      .schemaType('homePage')
                      .documentId(homePageId)
                      .title(`${market.title} Home Page (${language.title})`)
                      .views([S.view.form()]),
                  )
              },
            )

            return S.list().title('Internationalized Home Pages').items(items)
          }),
        )
    })
}
