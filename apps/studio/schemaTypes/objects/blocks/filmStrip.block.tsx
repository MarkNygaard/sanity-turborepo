import { FaFilm } from 'react-icons/fa'
import { defineField, defineType } from 'sanity'

export const filmStrip = defineType({
  name: 'filmStrip',
  title: 'Film Strip',
  icon: () => <FaFilm size={48} />,
  type: 'object',
  description: 'A horizontal strip of cards with images or videos',
  fields: [
    defineField({
      name: 'cards',
      type: 'array',
      title: 'Cards',
      of: [
        {
          type: 'object',
          name: 'card',
          title: 'Card',
          fields: [
            defineField({
              name: 'label',
              type: 'string',
              title: 'Label',
              validation: (Rule) => Rule.required().error('Card label is required'),
            }),
            defineField({
              name: 'buttons',
              title: 'Action Buttons',
              type: 'array',
              of: [{ type: 'button' }],
              validation: (Rule) => Rule.max(2).warning('Consider limiting to 2 buttons per card'),
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
              title: 'Image',
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
              title: 'Video',
              options: {
                accept: 'video/*',
                storeOriginalFilename: true,
              },
              fields: [
                defineField({
                  name: 'alt',
                  type: 'string',
                  title: 'Alternative text',
                  description: 'Important for SEO and accessibility',
                }),
                defineField({
                  name: 'poster',
                  type: 'image',
                  title: 'Poster Image',
                  description: 'Image to show while the video is loading',
                  options: {
                    hotspot: true,
                  },
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
          ],
          preview: {
            select: {
              label: 'label',
              mediaType: 'mediaType',
              image: 'image',
              video: 'video',
            },
            prepare: ({ label, mediaType, image, video }) => ({
              title: label || 'Untitled Card',
              subtitle: `${mediaType === 'image' ? 'Image' : 'Video'} Card`,
              media: mediaType === 'image' ? image : video,
            }),
          },
        },
      ],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .error('At least one card is required')
          .max(8)
          .warning('Consider limiting to 8 cards for better performance'),
    }),
  ],
  preview: {
    select: {
      cards: 'cards',
    },
    prepare: ({ cards = [] }) => ({
      title: 'Film Strip',
      subtitle: `${cards.length} card${cards.length === 1 ? '' : 's'}`,
    }),
  },
})
