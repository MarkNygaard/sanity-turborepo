import { TbColumns } from 'react-icons/tb'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const navigationColumnObject = defineType({
  name: 'navigationColumn',
  type: 'object',
  title: 'Navigation Column',
  icon: TbColumns,
  description: 'A column of navigation links with an optional title',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Column Title',
      description: 'The heading text displayed above this group of navigation links',
    }),
    defineField({
      name: 'links',
      type: 'array',
      title: 'Column Links',
      validation: (rule) => rule.required().min(1).error('At least one link is required'),
      description: 'The list of navigation links to display in this column',
      of: [defineArrayMember({ type: 'navigationColumnLink' })],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      links: 'links',
    },
    prepare({ title, links = [] }) {
      return {
        title: title || 'Untitled Column',
        subtitle: `${links.length} link${links.length === 1 ? '' : 's'}`,
      }
    },
  },
})

export default navigationColumnObject
