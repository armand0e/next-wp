import type { Block } from 'payload'

export const BentoGridBlock: Block = {
  slug: 'bento-grid',
  labels: {
    singular: 'Bento Grid',
    plural: 'Bento Grids',
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
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'id',
          type: 'text',
          required: true,
          admin: {
            description: 'Unique identifier for this item',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Item title',
          },
        },
        {
          name: 'content',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Item content/description',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional image for this item',
          },
        },
        {
          name: 'fullWidth',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Make this item span full width',
          },
        },
        {
          name: 'link',
          type: 'group',
          fields: [
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
            description: 'Optional link for this item',
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
    {
      name: 'animationStagger',
      type: 'number',
      defaultValue: 0.15,
      admin: {
        description: 'Delay between item animations (in seconds)',
      },
    },
  ],
}
