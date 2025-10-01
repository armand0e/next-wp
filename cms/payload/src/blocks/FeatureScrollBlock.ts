import type { Block } from 'payload'

export const FeatureScrollBlock: Block = {
  slug: 'feature-scroll',
  labels: {
    singular: 'Feature Scroll',
    plural: 'Feature Scrolls',
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
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Section description',
      },
    },
    {
      name: 'images',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
      admin: {
        description: 'Images that scroll horizontally',
      },
    },
    {
      name: 'enableParallax',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Enable parallax scrolling effects',
      },
    },
    {
      name: 'animationDelay',
      type: 'number',
      defaultValue: 0.15,
      admin: {
        description: 'Delay between image animations (in seconds)',
      },
    },
  ],
}
