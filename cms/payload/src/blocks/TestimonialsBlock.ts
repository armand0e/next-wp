import type { Block } from 'payload'

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  labels: {
    singular: 'Testimonials Section',
    plural: 'Testimonials Sections',
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
      name: 'testimonials',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'id',
          type: 'text',
          required: true,
          admin: {
            description: 'Unique identifier for this testimonial',
          },
        },
        {
          name: 'text',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Testimonial text/quote',
          },
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
              admin: {
                description: 'Author name',
              },
            },
            {
              name: 'role',
              type: 'text',
              admin: {
                description: 'Author job title/role',
              },
            },
            {
              name: 'company',
              type: 'text',
              admin: {
                description: 'Author company',
              },
            },
            {
              name: 'avatar',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Author profile photo',
              },
            },
          ],
        },
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
          admin: {
            description: 'Star rating (1-5)',
          },
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'masonry',
      options: [
        { label: 'Masonry Grid', value: 'masonry' },
        { label: 'Carousel', value: 'carousel' },
        { label: 'Grid', value: 'grid' },
      ],
      admin: {
        description: 'Layout style for testimonials',
      },
    },
    {
      name: 'enableAnimations',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Enable scroll animations',
      },
    },
  ],
}
