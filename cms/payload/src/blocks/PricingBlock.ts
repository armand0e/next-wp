import type { Block } from 'payload'

export const PricingBlock: Block = {
  slug: 'pricing',
  labels: {
    singular: 'Pricing Section',
    plural: 'Pricing Sections',
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
      name: 'tiers',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'id',
          type: 'text',
          required: true,
          admin: {
            description: 'Unique identifier for this pricing tier',
          },
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Tier name (e.g., "Basic", "Pro", "Enterprise")',
          },
        },
        {
          name: 'description',
          type: 'text',
          admin: {
            description: 'Short tier description',
          },
        },
        {
          name: 'price',
          type: 'text',
          required: true,
          admin: {
            description: 'Monthly price (e.g., "$9", "Free")',
          },
        },
        {
          name: 'period',
          type: 'text',
          defaultValue: 'month',
          admin: {
            description: 'Billing period (e.g., "month", "year")',
          },
        },
        {
          name: 'yearlyPrice',
          type: 'text',
          admin: {
            description: 'Yearly price (optional)',
          },
        },
        {
          name: 'yearlyDiscount',
          type: 'text',
          admin: {
            description: 'Yearly discount text (e.g., "Save 20%")',
          },
        },
        {
          name: 'features',
          type: 'array',
          required: true,
          fields: [
            {
              name: 'feature',
              type: 'text',
              required: true,
            },
          ],
          admin: {
            description: 'List of features included in this tier',
          },
        },
        {
          name: 'cta',
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
          name: 'isPopular',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Mark this tier as popular/recommended',
          },
        },
        {
          name: 'badge',
          type: 'text',
          admin: {
            description: 'Optional badge text (e.g., "Most Popular")',
          },
        },
      ],
    },
    {
      name: 'enableYearlyToggle',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Enable monthly/yearly pricing toggle',
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
