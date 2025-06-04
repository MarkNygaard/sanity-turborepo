import { TbLayoutBottombar } from 'react-icons/tb'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { PagePreviewMedia } from '../../components/previews/PagePreview'

export const footerDocument = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  icon: TbLayoutBottombar,
  description: 'Configure the footer content and structure for your site',
  groups: [
    {
      name: 'content',
      title: 'Content',
      default: true,
    },
    {
      name: 'structure',
      title: 'Footer Structure',
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
      initialValue: 'Footer',
      title: 'Footer Label',
      description: 'Internal label to identify this footer configuration in the CMS',
      validation: (rule) => rule.required().error('Label is required for identification'),
      group: 'technical',
    }),
    defineField({
      name: 'subtitle',
      type: 'text',
      rows: 2,
      title: 'Footer Subtitle',
      description: 'Subtitle text that appears beneath the logo in the footer',
      validation: (rule) =>
        rule.max(200).warning('Keep subtitle under 200 characters for best readability'),
      group: 'content',
    }),
    defineField({
      name: 'logo',
      type: 'image',
      title: 'Footer Logo',
      description: 'Logo to display in the footer (optional - will use site logo if not provided)',
      options: {
        hotspot: true,
      },
      group: 'content',
    }),
    defineField({
      name: 'columns',
      type: 'array',
      title: 'Footer Columns',
      description: 'Organize your footer links into columns with titles',
      validation: (rule) => rule.required().min(1).error('At least one footer column is required'),
      of: [defineArrayMember({ type: 'footerColumn' })],
      group: 'structure',
    }),
    defineField({
      name: 'copyrightText',
      type: 'string',
      title: 'Copyright Text',
      description: 'Copyright notice text (e.g., "© 2025 DILLING A/S. All rights reserved.")',
      group: 'content',
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
      columns: 'columns',
      logo: 'logo',
    },
    prepare({ title, language, market, columns = [], logo }) {
      const displayTitle = title || 'Footer'
      const subtitle = `${market?.toUpperCase() || 'Global'}${language ? ` • ${language.toUpperCase()}` : ''} • ${columns.length} column${columns.length === 1 ? '' : 's'}`

      return {
        title: displayTitle,
        subtitle,
        media: language ? <PagePreviewMedia language={language} /> : logo,
      }
    },
  },
})

export default footerDocument
