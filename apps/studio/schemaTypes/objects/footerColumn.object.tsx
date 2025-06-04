import { TbColumns } from 'react-icons/tb'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const footerColumnObject = defineType({
  name: 'footerColumn',
  type: 'object',
  title: 'Footer Column',
  icon: TbColumns,
  description: 'A column of footer links with a title',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Column Title',
      description: 'The heading text displayed above this group of footer links',
      validation: (rule) => rule.required().error('Column title is required'),
    }),
    defineField({
      name: 'links',
      type: 'array',
      title: 'Column Links',
      validation: (rule) => rule.required().min(1).error('At least one link is required'),
      description: 'The list of footer links to display in this column',
      of: [defineArrayMember({ type: 'footerColumnLink' })],
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

export default footerColumnObject
