import type { Block } from 'payload'

export const FeatureGridBlock: Block = {
  slug: 'feature-grid',
  labels: {
    singular: 'Feature Grid',
    plural: 'Feature Grids',
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
      name: 'columns',
      type: 'select',
      defaultValue: 3,
      options: [
        { label: '2 Columns', value: 2 },
        { label: '3 Columns', value: 3 },
        { label: '4 Columns', value: 4 },
      ],
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
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Feature name/title',
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
          name: 'icon',
          type: 'select',
          options: [
            { label: 'Brain', value: 'brain' },
            { label: 'Clock', value: 'clock' },
            { label: 'Calendar', value: 'calendar' },
            { label: 'Cloud', value: 'cloud' },
            { label: 'Users', value: 'users' },
            { label: 'Bell', value: 'bell' },
            { label: 'Shield', value: 'shield' },
            { label: 'Sparkles', value: 'sparkles' },
            { label: 'Rocket', value: 'rocket' },
            { label: 'Zap', value: 'zap' },
            { label: 'Bookmark', value: 'bookmark' },
            { label: 'Target', value: 'target' },
            { label: 'Layers', value: 'layers' },
            { label: 'Tablet', value: 'tablet' },
            { label: 'Component', value: 'component' },
            { label: 'Star', value: 'star' },
            { label: 'Message', value: 'message' },
            { label: 'Globe', value: 'globe' },
            { label: 'Settings', value: 'settings' },
            { label: 'List', value: 'list' },
            { label: 'Heart', value: 'heart' },
            { label: 'Check', value: 'check' },
            { label: 'Arrow Right', value: 'arrow-right' },
            { label: 'Chevron Right', value: 'chevron-right' },
            { label: 'None', value: 'none' },
          ],
          admin: {
            description: 'Icon to display with this feature',
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
            description: 'Optional link for this feature',
          },
        },
      ],
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
