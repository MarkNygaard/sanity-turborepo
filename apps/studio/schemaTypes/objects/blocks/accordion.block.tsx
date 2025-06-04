import { TbList } from 'react-icons/tb'
import { defineField, defineType } from 'sanity'

export const accordion = defineType({
  name: 'accordion',
  title: 'Accordion',
  icon: () => <TbList size={48} />,
  type: 'object',
  description: 'Collapsible panels for organizing content',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Accordion Title',
      description: 'Optional title to display above the accordion',
    }),
    defineField({
      name: 'panels',
      type: 'array',
      title: 'Panels',
      of: [
        {
          type: 'object',
          name: 'panel',
          title: 'Panel',
          fields: [
            defineField({
              name: 'label',
              type: 'string',
              title: 'Panel Title',
              validation: (Rule) => Rule.required().error('Panel title is required'),
            }),
            defineField({
              name: 'content',
              type: 'richText',
              title: 'Panel Content',
              validation: (Rule) => Rule.required().error('Panel content is required'),
            }),
            defineField({
              name: 'defaultOpen',
              type: 'boolean',
              title: 'Open by Default',
              description: 'Panel will be expanded when page loads',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              label: 'label',
              defaultOpen: 'defaultOpen',
            },
            prepare: ({ label, defaultOpen }) => ({
              title: label || 'Untitled Panel',
              subtitle: `Panel${defaultOpen ? ' • Default Open' : ''}`,
            }),
          },
        },
      ],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .error('At least one panel is required')
          .max(10)
          .warning('Consider limiting to 10 panels for better UX'),
    }),
    defineField({
      name: 'allowMultiple',
      type: 'boolean',
      title: 'Allow Multiple Panels Open',
      description: 'Allow multiple panels to be open simultaneously',
      initialValue: false,
    }),
    defineField({
      name: 'variant',
      type: 'string',
      title: 'Visual Style',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Bordered', value: 'bordered' },
          { title: 'Minimal', value: 'minimal' },
        ],
        layout: 'radio',
      },
      initialValue: 'default',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      panels: 'panels',
      allowMultiple: 'allowMultiple',
    },
    prepare: ({ title, panels = [], allowMultiple }) => ({
      title: title || 'Accordion',
      subtitle: `${panels.length} panel${panels.length === 1 ? '' : 's'}${allowMultiple ? ' • Multi-open' : ''}`,
    }),
  },
})
