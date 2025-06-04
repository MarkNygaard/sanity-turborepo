import { TbMenu2 } from 'react-icons/tb'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { PagePreviewMedia } from '../../components/previews/PagePreview'

export const navigationDocument = defineType({
  name: 'navigation',
  title: 'Site Navigation',
  type: 'document',
  icon: TbMenu2,
  description: 'Configure the main navigation structure for your site',
  groups: [
    {
      name: 'structure',
      title: 'Navigation Structure',
      default: true,
    },
    {
      name: 'technical',
      title: 'Technical',
    },
  ],
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      initialValue: 'Navigation',
      title: 'Navigation Label',
      description: 'Internal label to identify this navigation configuration in the CMS',
      validation: (rule) => rule.required().error('Label is required for identification'),
      group: 'technical',
    }),
    defineField({
      name: 'navigationItems',
      type: 'array',
      title: 'Navigation Structure',
      description: 'Build your navigation menu using dropdowns and individual links',
      validation: (rule) =>
        rule.required().min(1).error('At least one navigation item is required'),
      of: [
        defineArrayMember({ type: 'navigationDropdown' }),
        defineArrayMember({ type: 'navigationLink' }),
      ],
      group: 'structure',
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      readOnly: true,
      group: 'technical',
      description: 'This field is automatically managed by the system',
    }),
    defineField({
      name: 'market',
      title: 'Market',
      type: 'string',
      readOnly: true,
      group: 'technical',
      description: 'This field is automatically managed by the system',
    }),
  ],
  preview: {
    select: {
      title: 'label',
      language: 'language',
      market: 'market',
      navigationItems: 'navigationItems',
    },
    prepare({ title, language, market, navigationItems = [] }) {
      const displayTitle = title || 'Navigation'
      const subtitle = `${market?.toUpperCase() || 'Global'}${language ? ` • ${language.toUpperCase()}` : ''} • ${navigationItems.length} item${navigationItems.length === 1 ? '' : 's'}`

      return {
        title: displayTitle,
        subtitle,
        media: language ? <PagePreviewMedia language={language} /> : undefined,
      }
    },
  },
})
