import { TbSettings } from 'react-icons/tb'
import groq from 'groq'
import { map } from 'rxjs'
import { StructureBuilder, StructureResolverContext } from 'sanity/structure'
import { PagePreviewMedia } from '../components/previews/PagePreview'
import { apiVersion } from '../lib/api'

export const internationalisedSettingsStructure = async (
  S: StructureBuilder,
  context: StructureResolverContext,
) => {
  const documentStore = context.documentStore

  return S.listItem()
    .title('Settings')
    .id('internationalized-settings-list')
    .icon(TbSettings)
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
            "settings": *[_type == "settings"] {
              _id,
              siteTitle,
              language,
              market
            }
          }`,
          {},
          {
            tag: 'market-settings-list',
            apiVersion,
          },
        )
        .pipe(
          map((data) => {
            // Ensure we have data
            if (!data || !data.markets || !Array.isArray(data.markets)) {
              return S.list()
                .title('Settings')
                .items([
                  S.listItem()
                    .title('No markets found')
                    .id('no-markets-settings')
                    .child(S.documentList().title('No Markets').filter('_type == "market"')),
                ])
            }

            // Create a flat list of all market-language combinations
            const allSettingsCombinations = []

            for (const market of data.markets) {
              if (!market.languages || !Array.isArray(market.languages)) {
                continue
              }

              for (const language of market.languages) {
                const settingsId = `settings-${market.code}-${language.code}`
                const isDefault = language.isDefault === true

                allSettingsCombinations.push({
                  market,
                  language,
                  settingsId,
                  isDefault,
                })
              }
            }

            if (allSettingsCombinations.length === 0) {
              return S.list()
                .title('Settings')
                .items([
                  S.listItem()
                    .title('No combinations found')
                    .id('no-combinations-settings')
                    .child(S.documentList().title('Debug').filter('_type == "market"')),
                ])
            }

            // Sort combinations: market name first, then default languages first, then alphabetical
            allSettingsCombinations.sort((a, b) => {
              if (a.market.title !== b.market.title) {
                return a.market.title.localeCompare(b.market.title)
              }
              if (a.isDefault !== b.isDefault) {
                return b.isDefault ? 1 : -1
              }
              return a.language.title.localeCompare(b.language.title)
            })

            const items = allSettingsCombinations.map(
              ({ market, language, settingsId, isDefault }) => {
                // Check if these settings actually exist
                const settingsExists =
                  data.settings && data.settings.some((setting: any) => setting._id === settingsId)

                const title = `${market.title} - ${language.title}${isDefault ? ' (Default)' : ''}`
                const displayTitle = settingsExists ? `✅ ${title}` : `❌ ${title}`

                return S.listItem()
                  .title(displayTitle)
                  .id(`settings-${market.code}-${language.code}-item`)
                  .icon(() => <PagePreviewMedia language={language.code} />)
                  .child(
                    S.editor()
                      .id(settingsId)
                      .schemaType('settings')
                      .documentId(settingsId)
                      .title(`${market.title} Settings (${language.title})`)
                      .views([S.view.form()]),
                  )
              },
            )

            return S.list().title('Settings').items(items)
          }),
        )
    })
}
