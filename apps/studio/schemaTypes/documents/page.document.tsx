import { TbBrowser } from 'react-icons/tb'
import { defineField, defineType } from 'sanity'
import { PagePreviewMedia } from '../../components/previews/PagePreview'
import { isUniqueSlugPerLanguage } from '../../utils/slugValidation'
import SlugWithLanguageHelper from '../../components/inputs/SlugWithLanguagesHelper'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: TbBrowser,
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
      validation: (Rule) => Rule.required().error('Title is required for navigation and SEO'),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      components: {
        input: SlugWithLanguageHelper,
      },
      validation: (Rule) => Rule.required().error('Slug is required for page URLs'),
      options: {
        source: 'title',
        isUnique: isUniqueSlugPerLanguage,
        // Add a custom slugify function that handles international characters better
        slugify: (input) =>
          input
            .toLowerCase()
            .normalize('NFD') // Decompose accented characters
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .trim()
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-'), // Remove consecutive hyphens
      },
      group: 'settings',
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page Content',
      type: 'pageBuilder',
      description: 'Build your page content using flexible content blocks',
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
      slug: 'slug.current',
    },
    prepare({ title, language, market, slug }) {
      const subtitle = `${market?.toUpperCase() || 'Global'}${language ? ` • ${language.toUpperCase()}` : ''} • /${language || 'en'}/${slug || 'no-slug'}`

      return {
        title,
        subtitle,
        media: language ? <PagePreviewMedia language={language} /> : undefined,
      }
    },
  },
})
