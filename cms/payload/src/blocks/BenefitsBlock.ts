import type { Block } from 'payload'

export const BenefitsBlock: Block = {
  slug: 'benefits',
  labels: {
    singular: 'Benefits Section',
    plural: 'Benefits Sections',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Section title',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      admin: {
        description: 'Section subtitle',
      },
    },
    {
      name: 'benefits',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'id',
          type: 'text',
          required: true,
          admin: {
            description: 'Unique identifier for this benefit',
          },
        },
        {
          name: 'text',
          type: 'text',
          required: true,
          admin: {
            description: 'Benefit text/description',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional image for this benefit',
          },
        },
      ],
    },
    {
      name: 'enableCarousel',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Enable carousel/slider functionality',
      },
    },
    {
      name: 'autoPlay',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Auto-play the carousel',
      },
    },
    {
      name: 'autoPlayDelay',
      type: 'number',
      defaultValue: 5000,
      admin: {
        description: 'Auto-play delay in milliseconds',
        condition: (data) => data.autoPlay,
      },
    },
  ],
}
