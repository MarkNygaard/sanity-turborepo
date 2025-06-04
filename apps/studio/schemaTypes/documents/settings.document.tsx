import { TbSettings } from 'react-icons/tb'
import { defineField, defineType } from 'sanity'
import { PagePreviewMedia } from '../../components/previews/PagePreview'

export const settingsDocument = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: TbSettings,
  groups: [
    {
      name: 'general',
      title: 'General',
      default: true,
    },
    {
      name: 'seo',
      title: 'SEO',
    },
    {
      name: 'branding',
      title: 'Branding',
    },
    {
      name: 'technical',
      title: 'Technical',
    },
  ],
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      title: 'Label',
      description: 'Internal label to identify these settings',
      initialValue: 'Settings',
      validation: (rule) => rule.required().error('Label is required for identification'),
      group: 'technical',
    }),
    defineField({
      name: 'siteTitle',
      type: 'string',
      title: 'Site Title',
      description: 'The main title of your website, used in browser tabs and SEO',
      validation: (rule) =>
        rule
          .required()
          .error('Site title is required for SEO and branding')
          .max(60)
          .warning('Keep site title under 60 characters for optimal SEO'),
      group: ['general', 'seo'],
    }),
    defineField({
      name: 'siteDescription',
      type: 'text',
      title: 'Site Description',
      description: 'A brief description of your website for SEO purposes and meta tags',
      validation: (rule) =>
        rule
          .required()
          .error('Site description is required for SEO')
          .min(50)
          .warning('Description should be at least 50 characters')
          .max(160)
          .warning('Keep description under 160 characters for optimal SEO'),
      group: ['general', 'seo'],
    }),
    defineField({
      name: 'logo',
      type: 'image',
      title: 'Site Logo',
      description: 'Main logo for your website header and branding',
      options: {
        hotspot: true,
      },
      group: 'branding',
    }),
    defineField({
      name: 'favicon',
      type: 'image',
      title: 'Favicon',
      description: 'Small icon that appears in browser tabs (recommended: 32x32px)',
      options: {
        hotspot: true,
      },
      group: 'branding',
    }),
    defineField({
      name: 'socialShareImage',
      type: 'image',
      title: 'Default Social Share Image',
      description:
        'Default image used when pages are shared on social media (recommended: 1200x630px)',
      options: {
        hotspot: true,
      },
      group: ['seo', 'branding'],
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      readOnly: true,
      group: 'technical',
      description: 'This field is automatically managed by the system',
    }),
    defineField({
      name: 'market',
      title: 'Market',
      type: 'string',
      readOnly: true,
      group: 'technical',
      description: 'This field is automatically managed by the system',
    }),
  ],
  preview: {
    select: {
      title: 'siteTitle',
      label: 'label',
      language: 'language',
      market: 'market',
      logo: 'logo',
    },
    prepare({ title, label, language, market, logo }) {
      const displayTitle = title || label || 'Settings'
      const subtitle = `${market?.toUpperCase() || 'Global'}${language ? ` • ${language.toUpperCase()}` : ''}`

      return {
        title: displayTitle,
        subtitle,
        media: language ? <PagePreviewMedia language={language} /> : logo,
      }
    },
  },
})
