import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { BlocksFeature } from '@payloadcms/richtext-lexical'

// Import all block definitions
import { HeroBlock } from '../blocks/HeroBlock'
import { FeatureGridBlock } from '../blocks/FeatureGridBlock'
import { FeatureScrollBlock } from '../blocks/FeatureScrollBlock'
import { FeatureHighlightBlock } from '../blocks/FeatureHighlightBlock'
import { BentoGridBlock } from '../blocks/BentoGridBlock'
import { BenefitsBlock } from '../blocks/BenefitsBlock'
import { TestimonialsBlock } from '../blocks/TestimonialsBlock'
import { PricingBlock } from '../blocks/PricingBlock'
import { FAQBlock } from '../blocks/FAQBlock'
import { CTABlock } from '../blocks/CTABlock'
import { FooterBlock } from '../blocks/FooterBlock'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'template', 'status', 'updatedAt'],
  },
  access: {
    read: () => true, // Public read access for frontend
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL path for this page (e.g., "about", "contact")',
      },
    },
    {
      name: 'template',
      type: 'select',
      required: true,
      defaultValue: 'mobile',
      options: [
        { label: 'Mobile', value: 'mobile' },
        { label: 'SaaS', value: 'saas' },
        { label: 'Startup', value: 'startup' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    // SEO Meta fields
    {
      name: 'meta',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'Page title for SEO (defaults to page title if empty)',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Meta description for SEO',
          },
        },
        {
          name: 'keywords',
          type: 'array',
          fields: [
            {
              name: 'keyword',
              type: 'text',
            },
          ],
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Open Graph image for social sharing',
          },
        },
      ],
    },
    // Visual Block Editor
    {
      name: 'blocks',
      type: 'blocks',
      required: true,
      blocks: [
        HeroBlock,
        FeatureGridBlock,
        FeatureScrollBlock,
        FeatureHighlightBlock,
        BentoGridBlock,
        BenefitsBlock,
        TestimonialsBlock,
        PricingBlock,
        FAQBlock,
        CTABlock,
        FooterBlock,
      ],
      admin: {
        description: 'Drag and drop blocks to build your page visually',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        // Trigger webhook to Next.js for ISR revalidation
        if (doc.status === 'published') {
          const webhookUrl = process.env.NEXT_APP_REVALIDATE_URL
          const webhookSecret = process.env.PAYLOAD_WEBHOOK_SECRET
          
          if (webhookUrl && webhookSecret) {
            try {
              const payload = {
                action: 'page_updated',
                page: {
                  id: doc.id,
                  slug: doc.slug,
                  template: doc.template,
                },
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
              
              req.payload.logger.info(`Webhook sent for page: ${doc.slug}`)
            } catch (error) {
              req.payload.logger.error(`Webhook failed for page ${doc.slug}:`, error)
            }
          }
        }
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        // Trigger webhook for deleted pages
        const webhookUrl = process.env.NEXT_APP_REVALIDATE_URL
        const webhookSecret = process.env.PAYLOAD_WEBHOOK_SECRET
        
        if (webhookUrl && webhookSecret) {
          try {
            const payload = {
              action: 'page_deleted',
              page: {
                id: doc.id,
                slug: doc.slug,
                template: doc.template,
              },
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
            
            req.payload.logger.info(`Delete webhook sent for page: ${doc.slug}`)
          } catch (error) {
            req.payload.logger.error(`Delete webhook failed for page ${doc.slug}:`, error)
          }
        }
      },
    ],
  },
}
