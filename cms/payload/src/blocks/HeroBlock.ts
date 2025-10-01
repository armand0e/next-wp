import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero Section',
    plural: 'Hero Sections',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Small text above the main title',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Main hero title',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Hero description text',
      },
    },
    {
      name: 'textAlignment',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    // Primary CTA
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
          admin: {
            description: 'Rel attribute (e.g., "noopener noreferrer")',
          },
        },
      ],
    },
    // Secondary CTA (optional)
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
    },
    // Background image
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional background image',
      },
    },
    // Showcase images (for mobile apps, etc.)
    {
      name: 'showcaseImages',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
      admin: {
        description: 'Product screenshots, app mockups, etc.',
      },
    },
    // Download badges (App Store, Google Play)
    {
      name: 'downloadBadges',
      type: 'group',
      fields: [
        {
          name: 'appStore',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'App Store download badge',
          },
        },
        {
          name: 'googlePlay',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Google Play download badge',
          },
        },
      ],
    },
    // Animation settings
    {
      name: 'enableParallax',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Enable parallax scrolling effects',
      },
    },
  ],
}
