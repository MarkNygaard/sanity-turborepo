import { TbStar } from 'react-icons/tb'
import { defineField, defineType } from 'sanity'

export const hero = defineType({
  name: 'hero',
  title: 'Hero Carousel',
  icon: () => <TbStar size={48} />,
  type: 'object',
  description: 'A hero section with multiple slides (carousel)',
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
      name: 'slides',
      type: 'array',
      title: 'Slides',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'heroSlide',
          title: 'Slide',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              title: 'Title',
              validation: (Rule) => Rule.required().error('Slide title is required'),
            }),
            defineField({
              name: 'subTitle',
              type: 'string',
              title: 'Subtitle',
            }),
            defineField({
              name: 'buttons',
              title: 'Action Buttons',
              type: 'array',
              of: [{ type: 'button' }],
              validation: (Rule) => Rule.max(2).warning('Consider limiting to 2 buttons per slide'),
            }),
            defineField({
              name: 'mediaType',
              type: 'string',
              title: 'Media Type',
              options: {
                list: [
                  { title: 'Image', value: 'image' },
                  { title: 'Video', value: 'video' },
                ],
                layout: 'radio',
              },
              initialValue: 'image',
            }),
            defineField({
              name: 'image',
              type: 'image',
              title: 'Background Image',
              options: {
                hotspot: true,
                accept: 'image/*',
                storeOriginalFilename: true,
              },
              fields: [
                defineField({
                  name: 'alt',
                  type: 'string',
                  title: 'Alternative text',
                  description: 'Important for SEO and accessibility',
                  validation: (Rule) =>
                    Rule.required().error('Alt text is required for accessibility'),
                }),
              ],
              hidden: ({ parent }) => parent?.mediaType !== 'image',
              validation: (rule) =>
                rule.custom((value, context) => {
                  const mediaType = (context.parent as any)?.mediaType
                  if (mediaType === 'image' && !value) {
                    return 'Image is required when media type is image'
                  }
                  return true
                }),
            }),
            defineField({
              name: 'video',
              type: 'file',
              title: 'Background Video',
              description: 'Video will autoplay and loop in the background',
              options: {
                accept: 'video/*',
                storeOriginalFilename: true,
              },
              fields: [
                defineField({
                  name: 'poster',
                  type: 'image',
                  title: 'Poster Image',
                  description: 'Fallback image if video fails to load',
                  options: {
                    hotspot: true,
                  },
                  validation: (Rule) =>
                    Rule.required().error('Poster image is required for video backgrounds'),
                }),
              ],
              hidden: ({ parent }) => parent?.mediaType !== 'video',
              validation: (rule) =>
                rule.custom((value, context) => {
                  const mediaType = (context.parent as any)?.mediaType
                  if (mediaType === 'video' && !value) {
                    return 'Video is required when media type is video'
                  }
                  return true
                }),
            }),
            defineField({
              name: 'contentAlignment',
              type: 'string',
              title: 'Content Alignment',
              options: {
                list: [
                  { title: 'Left', value: 'left' },
                  { title: 'Center', value: 'center' },
                  { title: 'Right', value: 'right' },
                ],
                layout: 'radio',
              },
              initialValue: 'center',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'subTitle',
              mediaType: 'mediaType',
              image: 'image',
              video: 'video',
            },
            prepare: ({ title, subtitle, mediaType, image, video }) => ({
              title: title || 'Untitled Slide',
              subtitle: subtitle || `${mediaType === 'image' ? 'Image' : 'Video'} slide`,
              media: mediaType === 'image' ? image : video,
            }),
          },
        },
      ],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .error('At least one slide is required')
          .max(5)
          .warning('Consider limiting to 5 slides for better performance'),
    }),
    defineField({
      name: 'autoplay',
      type: 'boolean',
      title: 'Autoplay Slides',
      description: 'Automatically advance slides',
      initialValue: false,
      group: 'settings',
    }),
    defineField({
      name: 'slideInterval',
      type: 'number',
      title: 'Slide Interval (seconds)',
      description: 'Time between slide transitions when autoplay is enabled',
      initialValue: 5,
      validation: (Rule) => Rule.min(3).max(10).integer(),
      hidden: ({ parent }) => !parent?.autoplay,
      group: 'settings',
    }),
  ],
  preview: {
    select: {
      slides: 'slides',
      autoplay: 'autoplay',
    },
    prepare: ({ slides = [], autoplay }) => ({
      title: 'Hero Carousel',
      subtitle: `${slides.length} slide${slides.length === 1 ? '' : 's'}${autoplay ? ' • Autoplay' : ''}`,
    }),
  },
})
