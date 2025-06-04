import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'bookmark',
  type: 'object',
  title: 'BookMark',
  fields: [
    defineField({
      name: 'reference',
      title: 'Reference',
      type: 'reference',
      to: [
        { type: 'page' },
        { type: 'market' },
        { type: 'person' },
        { type: 'language' },
        { type: 'settings' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'note',
      title: 'Note',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      referenceName: 'reference.name',
      referenceTitle: 'reference.title',
      referenceSiteTitle: 'reference.siteTitle',
      subtitle: 'note',
    },
    prepare(selection) {
      return {
        title: selection.referenceName || selection.referenceTitle || selection.referenceSiteTitle,
        subtitle: selection.subtitle,
      }
    },
  },
})
