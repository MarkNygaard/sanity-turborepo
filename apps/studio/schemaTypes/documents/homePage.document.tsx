import { TbHome } from 'react-icons/tb'
import { defineField, defineType } from 'sanity'
import { PagePreviewMedia } from '../../components/previews/PagePreview'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: TbHome,
  groups: [
    {
      name: 'content',
      title: 'Content',
      default: true,
    },
    {
      name: 'settings',
      title: 'Settings',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'body',
      group: 'content',
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      readOnly: true,
      group: 'settings',
      description: 'This field is automatically managed by the system',
    }),
    defineField({
      name: 'market',
      title: 'Market',
      type: 'string',
      readOnly: true,
      group: 'settings',
      description: 'This field is automatically managed by the system',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      language: 'language',
      market: 'market',
    },
    prepare({ title, language, market }) {
      return {
        title: title || 'Home Page',
        subtitle: `${market?.toUpperCase() || 'Global'}${language ? ` • ${language.toUpperCase()}` : ''}`,
        media: language ? <PagePreviewMedia language={language} /> : undefined,
      }
    },
  },
})
