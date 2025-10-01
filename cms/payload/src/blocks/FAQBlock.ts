import type { Block } from 'payload'

export const FAQBlock: Block = {
  slug: 'faq',
  labels: {
    singular: 'FAQ Section',
    plural: 'FAQ Sections',
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
      name: 'faqs',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'id',
          type: 'text',
          required: true,
          admin: {
            description: 'Unique identifier for this FAQ',
          },
        },
        {
          name: 'question',
          type: 'text',
          required: true,
          admin: {
            description: 'FAQ question',
          },
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
          admin: {
            description: 'FAQ answer',
          },
        },
      ],
    },
    {
      name: 'enableSearch',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Enable search functionality',
      },
    },
    {
      name: 'defaultOpen',
      type: 'array',
      fields: [
        {
          name: 'faqId',
          type: 'text',
          admin: {
            description: 'FAQ ID to open by default',
          },
        },
      ],
      admin: {
        description: 'FAQs that should be open by default',
      },
    },
  ],
}
