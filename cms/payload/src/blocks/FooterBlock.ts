import type { Block } from 'payload'

export const FooterBlock: Block = {
  slug: 'footer',
  labels: {
    singular: 'Footer',
    plural: 'Footers',
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Footer logo',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      admin: {
        description: 'Company tagline or slogan',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Company description',
      },
    },
    {
      name: 'columns',
      type: 'array',
      fields: [
        {
          name: 'id',
          type: 'text',
          required: true,
          admin: {
            description: 'Unique identifier for this column',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Column title',
          },
        },
        {
          name: 'links',
          type: 'array',
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
      ],
      admin: {
        description: 'Footer link columns',
      },
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Twitter', value: 'twitter' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'GitHub', value: 'github' },
            { label: 'Discord', value: 'discord' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Social media links',
      },
    },
    {
      name: 'copyright',
      type: 'text',
      admin: {
        description: 'Copyright text (year will be auto-generated)',
      },
    },
    {
      name: 'bottomLinks',
      type: 'array',
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
      admin: {
        description: 'Bottom footer links (Privacy, Terms, etc.)',
      },
    },
  ],
}
