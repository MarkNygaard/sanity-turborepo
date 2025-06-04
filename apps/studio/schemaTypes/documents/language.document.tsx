import { TbLanguage } from 'react-icons/tb'
import { defineType } from 'sanity'

export default defineType({
  name: 'language',
  title: 'Language',
  type: 'document',
  icon: TbLanguage,

  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'code',
      title: 'Code',
      type: 'string',
      validation: (Rule) => Rule.required().regex(/^[a-z]{2}-[A-Z]{2}$/),
    },
    {
      name: 'isDefault',
      title: 'Is Default',
      type: 'boolean',
    },
  ],
})
