import { CogIcon } from '@sanity/icons'
import { StructureBuilder, StructureResolverContext } from 'sanity/structure'
import { Person } from '../schemaTypes/documents/person.document'
import { hiddenDocTypes } from './hiddenDocTypes'
import { internationalisedHomePagesStructure } from './internationalisedHomePagesStructure'
import { internationalisedPagesStructure } from './internationalisedPagesStructure'
import { personalStructure } from './personalStructure'
import { internationalisedSettingsStructure } from './internationalisedSettingsStructure'

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

      S.listItem().title(`All Pages`).child(S.documentTypeList('page').title('Pages')),
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
