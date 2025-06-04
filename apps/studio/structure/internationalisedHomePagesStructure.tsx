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

  const marketHomePages = documentStore
    .listenQuery(
      groq`{
        "markets": *[_type == "market"]|order(title asc) {
          _id,
          title,
          code,
          "languages": languages[]->{code, title, _id, isDefault},
          "defaultLanguage": languages[isDefault == true][0]->{
            code,
            title,
            _id
          },
          "firstLanguage": languages[0]->{
            code,
            title,
            _id
          }
        },
        "homePages": *[_type == "homePage"] {
          _id,
          title,
          language
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
        return S.list()
          .title('Internationalized Home Pages')
          .items([
            // Regular home page items
            ...data.markets
              .filter((market: any) => market.languages && market.languages.length > 0)
              .map(
                (market: {
                  title: string
                  code: string
                  _id: string
                  languages: Array<{
                    code: string
                    title: string
                    _id: string
                    isDefault?: boolean
                  }>
                  defaultLanguage?: { code: string; title: string; _id: string }
                  firstLanguage?: { code: string; title: string; _id: string }
                }) => {
                  // Use default language if available, otherwise use first language
                  const targetLanguage = market.defaultLanguage || market.firstLanguage

                  if (!targetLanguage) {
                    return null
                  }

                  const homePageId = `home-page-${market.code}-${targetLanguage.code}`
                  const isDefault = market.defaultLanguage ? true : false

                  // Check if this home page actually exists
                  const homePageExists = data.homePages.some((hp: any) => hp._id === homePageId)

                  const title = `${market.title} Home Page${!isDefault ? ' (First Language)' : ''}`
                  const displayTitle = homePageExists ? `✅ ${title}` : `❌ ${title}`

                  return S.listItem()
                    .title(displayTitle)
                    .id(`home-page-${market.code}`)
                    .icon(() => <PagePreviewMedia language={targetLanguage.code} />)
                    .child(
                      S.editor()
                        .id(homePageId)
                        .schemaType('homePage')
                        .documentId(homePageId)
                        .title(`${market.title} Home Page (${targetLanguage.title})`)
                        .views([S.view.form()]),
                    )
                },
              )
              .filter(Boolean), // Remove null items
          ])
      }),
    )

  return S.listItem()
    .title('Home Pages')
    .id('internationalized-home-pages-list')
    .icon(TbHome)
    .child(() => marketHomePages)
}
