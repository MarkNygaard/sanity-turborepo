import { TbClick } from 'react-icons/tb'
import { defineField, defineType } from 'sanity'

const buttonVariants = [
  'default',
  'secondary',
  'outline',
  'link',
  'ghost',
  'destructive',
  'fullGhost',
  'CTA',
]

export const button = defineType({
  name: 'button',
  title: 'Button',
  type: 'object',
  icon: TbClick,
  fields: [
    defineField({
      name: 'variant',
      type: 'string',
      title: 'Button Style',
      options: {
        list: buttonVariants.map((variant) => ({
          title: variant.charAt(0).toUpperCase() + variant.slice(1),
          value: variant,
        })),
        layout: 'dropdown',
      },
      initialValue: 'default',
    }),
    defineField({
      name: 'text',
      title: 'Button Text',
      type: 'string',
      validation: (Rule) => Rule.required().error('Button text is required'),
    }),
    defineField({
      name: 'linkType',
      type: 'string',
      title: 'Link Type',
      options: {
        list: [
          { title: 'Internal Page', value: 'internal' },
          { title: 'External URL', value: 'external' },
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'internalLink',
      type: 'reference',
      title: 'Internal Page',
      to: [{ type: 'page' }],
      options: {
        filter: ({ document }) => {
          let currentLang = null

          // Method 1: Try to get language from document field
          if (document?.language) {
            currentLang = document.language
          }

          // Method 2: Extract language from document ID pattern
          if (!currentLang && document?._id) {
            // Pattern: home-page-{market}-{language} or settings-{market}-{language}
            const idParts = document._id.replace('drafts.', '').split('-')

            if (idParts.length >= 3) {
              // For home-page-EU-en-EU: ["home", "page", "EU", "en", "EU"]
              // We want the language part which is "en-EU"
              if (idParts.length === 5 && (idParts[0] === 'home' || idParts[0] === 'settings')) {
                // Reconstruct language code: en-EU
                currentLang = `${idParts[3]}-${idParts[4]}`
              } else if (idParts.length === 4) {
                // For pattern like "navigation-EU-en-EU": ["navigation", "EU", "en", "EU"]
                currentLang = `${idParts[2]}-${idParts[3]}`
              }
            }
          }

          // Method 3: Fallback to show all pages if we can't determine language
          if (!currentLang) {
            console.warn('Could not determine language context. Showing all pages.')
            return {
              filter: '_type == "page"',
              params: {},
            }
          }
          return {
            filter: 'language == $lang',
            params: {
              lang: currentLang,
            },
          }
        },
      },
      hidden: ({ parent }) => parent?.linkType !== 'internal',
      validation: (rule) =>
        rule.custom((value, context) => {
          const linkType = (context.parent as any)?.linkType
          if (linkType === 'internal' && !value) {
            return 'Internal page is required when link type is internal'
          }
          return true
        }),
    }),
    defineField({
      name: 'externalLink',
      type: 'url',
      title: 'External URL',
      hidden: ({ parent }) => parent?.linkType !== 'external',
      validation: (rule) =>
        rule.custom((value, context) => {
          const linkType = (context.parent as any)?.linkType
          if (linkType === 'external' && !value) {
            return 'External URL is required when link type is external'
          }
          return true
        }),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      description: 'If checked, the link will open in a new tab',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'text',
      variant: 'variant',
      linkType: 'linkType',
      internalLink: 'internalLink.title',
      externalLink: 'externalLink',
      openInNewTab: 'openInNewTab',
    },
    prepare: ({ title, variant, externalLink, linkType, internalLink, openInNewTab }) => {
      const newTabIndicator = openInNewTab ? ' ↗' : ''
      const linkTarget = linkType === 'internal' ? internalLink : externalLink
      const variantDisplay = variant?.charAt(0).toUpperCase() + variant?.slice(1) || 'Default'

      return {
        title: title || 'Untitled Button',
        subtitle: `${variantDisplay} • ${linkType === 'internal' ? 'Internal' : 'External'}: ${linkTarget}${newTabIndicator}`,
      }
    },
  },
})
