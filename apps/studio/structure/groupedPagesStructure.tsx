import { TbFiles } from 'react-icons/tb'
import groq from 'groq'
import { map } from 'rxjs'
import { StructureBuilder, StructureResolverContext } from 'sanity/structure'
import { PagePreviewMedia } from '../components/previews/PagePreview'
import { apiVersion } from '../lib/api'

export const groupedPagesStructure = async (
  S: StructureBuilder,
  context: StructureResolverContext,
) => {
  const documentStore = context.documentStore

  const groupedPages = documentStore
    .listenQuery(
      groq`{
        "translationGroups": *[_type == "translation.metadata" && "page" in schemaTypes] {
          _id,
          "pages": translations[defined(value._ref)].value-> {
            _id,
            title,
            language,
            market,
            slug,
            _updatedAt
          }
        }[defined(pages) && count(pages) > 0] | order(pages[0].title asc),
        "standalonePages": *[
          _type == "page" 
          && !(_id in *[_type == "translation.metadata" && "page" in schemaTypes].translations[].value._ref)
        ] {
          _id,
          title,
          language,
          market,
          slug,
          _updatedAt
        } | order(title asc)
      }`,
      {},
      {
        tag: 'grouped-pages-list',
        apiVersion,
      },
    )
    .pipe(
      map((data) => {
        if (!data) {
          return S.list()
            .title('Grouped Pages')
            .items([
              S.listItem()
                .title('No pages found')
                .id('no-pages')
                .child(S.documentList().title('No Pages').filter('_type == "page"')),
            ])
        }

        const items = []

        // Process translation groups
        if (data.translationGroups?.length > 0) {
          data.translationGroups.forEach((group: any) => {
            const validPages = group.pages?.filter((page: any) => page && page._id) || []

            if (validPages.length === 0) return

            // Find the preferred page to display (en-GB first, then first available)
            const preferredPage =
              validPages.find((page: any) => page.language === 'en-GB') || validPages[0]

            const groupTitle = preferredPage.title || 'Untitled Page'
            const languageCount = validPages.length

            items.push(
              S.listItem()
                .title(
                  `${groupTitle} (${languageCount} ${languageCount === 1 ? 'language' : 'languages'})`,
                )
                .id(`translation-group-${group._id}`)
                .icon(() => <PagePreviewMedia language={preferredPage.language} />)
                .child(
                  S.list()
                    .title(`"${groupTitle}" - All Languages`)
                    .items([
                      // Primary page (preferred)
                      S.listItem()
                        .title(`${preferredPage.title} (Primary)`)
                        .id(`primary-${preferredPage._id}`)
                        .icon(() => <PagePreviewMedia language={preferredPage.language} />)
                        .child(
                          S.document()
                            .documentId(preferredPage._id)
                            .schemaType('page')
                            .title(
                              `${preferredPage.title} (${preferredPage.language.toUpperCase()})`,
                            ),
                        ),

                      S.divider(),

                      // All language versions
                      ...validPages
                        .sort((a: any, b: any) => a.language.localeCompare(b.language))
                        .map((page: any) =>
                          S.listItem()
                            .title(`${page.title} (${page.language.toUpperCase()})`)
                            .id(`page-${page._id}`)
                            .icon(() => <PagePreviewMedia language={page.language} />)
                            .child(
                              S.document()
                                .documentId(page._id)
                                .schemaType('page')
                                .title(`${page.title} (${page.language.toUpperCase()})`),
                            ),
                        ),
                    ]),
                ),
            )
          })
        }

        // Add standalone pages (pages without translations)
        if (data.standalonePages?.length > 0) {
          // Add divider if there are translation groups
          if (items.length > 0) {
            items.push(S.divider())
          }

          data.standalonePages.forEach((page: any) => {
            items.push(
              S.listItem()
                .title(
                  `${page.title} (Sinlge language) ${page.language?.toUpperCase() || 'NO LANG'}`,
                )
                .id(`standalone-${page._id}`)
                .icon(() => <PagePreviewMedia language={page.language || 'en'} />)
                .child(
                  S.document()
                    .documentId(page._id)
                    .schemaType('page')
                    .title(`${page.title} (${page.language?.toUpperCase() || 'NO LANG'})`),
                ),
            )
          })
        }

        return S.list()
          .title('Grouped Pages')
          .items(
            items.length > 0
              ? items
              : [
                  S.listItem()
                    .title('No pages found')
                    .id('no-pages-fallback')
                    .child(S.documentList().title('All Pages').filter('_type == "page"')),
                ],
          )
      }),
    )

  return S.listItem()
    .title('All Pages (Grouped)')
    .id('grouped-pages-list')
    .icon(TbFiles)
    .child(() => groupedPages)
}
