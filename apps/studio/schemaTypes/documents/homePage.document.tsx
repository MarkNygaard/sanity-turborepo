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
      validation: (Rule) => Rule.required().error('Title is required for SEO and navigation'),
      group: 'content',
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page Content',
      type: 'pageBuilder',
      description: 'Build your home page content using flexible content blocks',
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
