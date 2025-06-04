import { defineArrayMember, defineType } from 'sanity'
import { TbLayoutGrid } from 'react-icons/tb'
import { hero, filmStrip, accordion } from './blocks'

export const pageBuilderBlocks = [hero, filmStrip, accordion]

export const pagebuilderBlockTypes = pageBuilderBlocks.map(({ name }) => ({
  type: name,
}))

export const pageBuilder = defineType({
  name: 'pageBuilder',
  title: 'Page Builder',
  type: 'array',
  icon: TbLayoutGrid,
  description: 'Build your page content using flexible, reusable blocks',
  of: pagebuilderBlockTypes.map((block) => defineArrayMember(block)),
  options: {
    insertMenu: {
      views: [{ name: 'grid' }, { name: 'list' }],
    },
  },
})
