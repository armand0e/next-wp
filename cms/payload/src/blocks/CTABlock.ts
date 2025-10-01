import type { Block } from 'payload'

export const CTABlock: Block = {
  slug: 'cta',
  labels: {
    singular: 'Call to Action',
    plural: 'Call to Actions',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'CTA title',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      admin: {
        description: 'CTA subtitle',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'CTA description',
      },
    },
    {
      name: 'primaryCta',
      type: 'group',
      required: true,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          required: true,
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
    },
    {
      name: 'secondaryCta',
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
        description: 'Optional secondary CTA',
      },
    },
    {
      name: 'backgroundType',
      type: 'select',
      defaultValue: 'solid',
      options: [
        { label: 'Solid Color', value: 'solid' },
        { label: 'Gradient', value: 'gradient' },
        { label: 'Image', value: 'image' },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'text',
      admin: {
        description: 'Background color (hex code)',
        condition: (data) => data.backgroundType === 'solid',
      },
    },
    {
      name: 'gradientColors',
      type: 'group',
      fields: [
        {
          name: 'from',
          type: 'text',
          admin: {
            description: 'Gradient start color (hex code)',
          },
        },
        {
          name: 'to',
          type: 'text',
          admin: {
            description: 'Gradient end color (hex code)',
          },
        },
      ],
      admin: {
        condition: (data) => data.backgroundType === 'gradient',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data) => data.backgroundType === 'image',
      },
    },
    {
      name: 'enableMarquee',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Enable testimonial marquee',
      },
    },
    {
      name: 'marqueeItems',
      type: 'array',
      fields: [
        {
          name: 'id',
          type: 'text',
          required: true,
        },
        {
          name: 'text',
          type: 'textarea',
          required: true,
        },
        {
          name: 'author',
          type: 'group',
          required: true,
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'role',
              type: 'text',
            },
            {
              name: 'company',
              type: 'text',
            },
            {
              name: 'avatar',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
        },
      ],
      admin: {
        condition: (data) => data.enableMarquee,
        description: 'Testimonials to display in marquee',
      },
    },
  ],
}
