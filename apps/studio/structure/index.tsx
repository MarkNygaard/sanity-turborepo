import { CogIcon } from '@sanity/icons'
import { StructureBuilder, StructureResolverContext } from 'sanity/structure'
import { Person } from '../schemaTypes/documents/person.document'
import { hiddenDocTypes } from './hiddenDocTypes'
import { internationalisedHomePagesStructure } from './internationalisedHomePagesStructure'
import { internationalisedPagesStructure } from './internationalisedPagesStructure'
import { groupedPagesStructure } from './groupedPagesStructure' // New import
import { personalStructure } from './personalStructure'
import { internationalisedSettingsStructure } from './internationalisedSettingsStructure'
import { internationalisedNavigationStructure } from './internationalisedNavigationStructure'
import { internationalisedFooterStructure } from './internationalisedFooterStructure'

/** # Structure Tool with Custom Structure list
 *
 * This is the custom structure tool for the studio.
 *
 * ## AI Assist context document type
 *
 * the `assist.instruction.context` document type is hidden here {@link hiddenDocTypes}
 *
 * ## Translation metadata
 *
 * the `translation.metadata` document type is hidden and managed automatically by the document-internationalization plugin
 *
 * (go to the Template Structure to work on those)
 */
export const customStructure = async (
  S: StructureBuilder,
  context: StructureResolverContext,
  person: Person | null,
) => {
  return S.list()
    .title('Content')
    .items([
      await personalStructure(S, context, person),

      // Internationalized Home Pages
      await internationalisedHomePagesStructure(S, context),

      S.divider(),

      // NEW: Grouped Pages - shows one page per internal title with preference for en-GB
      await groupedPagesStructure(S, context),

      // Keep the detailed internationalized pages structure for power users
      await internationalisedPagesStructure(S, context),

      S.divider(),

      S.listItem()
        .title('Sources & Settings')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Sources & Settings')
            .items([
              await internationalisedSettingsStructure(S, context),
              await internationalisedNavigationStructure(S, context),
              await internationalisedFooterStructure(S, context),
              S.divider(),
              S.documentTypeListItem('language').title('Languages'),
              S.documentTypeListItem('market').title('Markets'),
              S.divider(),
              S.documentTypeListItem('person').title('Studio Members (persons)'),
              S.divider(),
            ]),
        ),
    ])
}
