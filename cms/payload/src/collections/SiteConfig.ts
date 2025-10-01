import type { CollectionConfig } from 'payload'

export const SiteConfig: CollectionConfig = {
  slug: 'site-config',
  admin: {
    useAsTitle: 'name',
    description: 'Global site configuration and branding',
  },
  access: {
    read: () => true, // Public read access for frontend
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Site name displayed in header and meta tags',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Site description for SEO and meta tags',
      },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description: 'Primary site URL (e.g., https://example.com)',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Site logo displayed in header',
      },
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Site favicon (32x32 PNG recommended)',
      },
    },
    // Default meta for pages that don't have custom meta
    {
      name: 'defaultMeta',
      type: 'group',
      fields: [
        {
          name: 'keywords',
          type: 'array',
          fields: [
            {
              name: 'keyword',
              type: 'text',
            },
          ],
          admin: {
            description: 'Default keywords for SEO',
          },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Default Open Graph image for social sharing',
          },
        },
      ],
    },
    // Theme configuration
    {
      name: 'theme',
      type: 'group',
      fields: [
        {
          name: 'primaryColor',
          type: 'text',
          admin: {
            description: 'Primary brand color (hex code, e.g., #3b82f6)',
          },
        },
        {
          name: 'secondaryColor',
          type: 'text',
          admin: {
            description: 'Secondary brand color (hex code)',
          },
        },
        {
          name: 'fontFamily',
          type: 'select',
          options: [
            { label: 'Inter', value: 'Inter, sans-serif' },
            { label: 'Roboto', value: 'Roboto, sans-serif' },
            { label: 'Open Sans', value: 'Open Sans, sans-serif' },
            { label: 'Lato', value: 'Lato, sans-serif' },
            { label: 'Montserrat', value: 'Montserrat, sans-serif' },
          ],
          defaultValue: 'Inter, sans-serif',
        },
      ],
    },
    // Analytics and integrations
    {
      name: 'analytics',
      type: 'group',
      fields: [
        {
          name: 'googleAnalyticsId',
          type: 'text',
          admin: {
            description: 'Google Analytics tracking ID (e.g., GA-XXXXXXXXX)',
          },
        },
        {
          name: 'googleTagManagerId',
          type: 'text',
          admin: {
            description: 'Google Tag Manager ID (e.g., GTM-XXXXXXX)',
          },
        },
      ],
    },
    // Social media links
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
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        // Trigger webhook to Next.js for site config updates
        const webhookUrl = process.env.NEXT_APP_REVALIDATE_URL
        const webhookSecret = process.env.PAYLOAD_WEBHOOK_SECRET
        
        if (webhookUrl && webhookSecret) {
          try {
            const payload = {
              action: 'site_config_updated',
              timestamp: Date.now(),
            }
            
            const crypto = await import('crypto')
            const signature = `sha256=${crypto
              .createHmac('sha256', webhookSecret)
              .update(JSON.stringify(payload))
              .digest('hex')}`
            
            await fetch(webhookUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Next-WP-Signature': signature,
              },
              body: JSON.stringify(payload),
            })
            
            req.payload.logger.info('Site config webhook sent')
          } catch (error) {
            req.payload.logger.error('Site config webhook failed:', error)
          }
        }
      },
    ],
  },
}
