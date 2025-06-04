import { TbChevronDown } from 'react-icons/tb'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const navigationDropdownObject = defineType({
  name: 'navigationDropdown',
  type: 'object',
  title: 'Navigation Dropdown',
  icon: TbChevronDown,
  description: 'A dropdown menu containing multiple columns of navigation links',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Dropdown Title',
      description: 'The main menu item text that triggers this dropdown',
      validation: (rule) => rule.required().error('Dropdown title is required'),
    }),
    defineField({
      name: 'columns',
      type: 'array',
      title: 'Columns',
      validation: (rule) => rule.required().min(1).error('At least one column is required'),
      description: 'The columns of navigation links to display in this dropdown',
      of: [defineArrayMember({ type: 'navigationColumn' })],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      columns: 'columns',
    },
    prepare({ title, columns = [] }) {
      const totalLinks = (columns as any[]).reduce(
        (sum: number, column: any) => sum + (column.links?.length || 0),
        0,
      )
      return {
        title: title || 'Untitled Dropdown',
        subtitle: `${columns.length} column${columns.length === 1 ? '' : 's'}, ${totalLinks} total links`,
      }
    },
  },
})

export default navigationDropdownObject
