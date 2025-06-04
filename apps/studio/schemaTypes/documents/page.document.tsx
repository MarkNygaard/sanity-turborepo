import { TbBrowser } from 'react-icons/tb'
import { defineField, defineType } from 'sanity'
import { PagePreviewMedia } from '../../components/previews/PagePreview'
export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: TbBrowser,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'body',
    }),
    defineField({
      name: 'language',
      type: 'string',
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      language: 'language',
    },
    prepare({ title, language }) {
      return {
        title,
        media: language ? <PagePreviewMedia language={language} /> : undefined,
      }
    },
  },
})
