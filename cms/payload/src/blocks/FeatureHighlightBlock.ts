import type { Block } from 'payload'

export const FeatureHighlightBlock: Block = {
  slug: 'feature-highlight',
  labels: {
    singular: 'Feature Highlight',
    plural: 'Feature Highlights',
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
      name: 'features',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'id',
          type: 'text',
          required: true,
          admin: {
            description: 'Unique identifier for this feature',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Feature title',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Feature description',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Feature image or screenshot',
          },
        },
        {
          name: 'direction',
          type: 'select',
          defaultValue: 'left',
          options: [
            { label: 'Image Left, Text Right', value: 'left' },
            { label: 'Image Right, Text Left', value: 'right' },
          ],
          admin: {
            description: 'Layout direction for this feature',
          },
        },
        {
          name: 'cta',
          type: 'group',
          fields: [
            {
              name: 'label',
              type: 'text',
            },
            {
              name: 'href',
              type: 'text',
            },
            {
              name: 'target',
              type: 'select',
              defaultValue: '_self',
              options: [
                { label: 'Same Window', value: '_self' },
                { label: 'New Window', value: '_blank' },
              ],
            },
            {
              name: 'rel',
              type: 'text',
            },
          ],
          admin: {
            description: 'Optional call-to-action button',
          },
        },
      ],
    },
    {
      name: 'enableScrollAnimations',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Enable scroll-triggered animations',
      },
    },
  ],
}
