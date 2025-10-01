import express from 'express'
import payload from 'payload'
import { config } from 'dotenv'

// Load environment variables
config()

const app = express()
const PORT = process.env.PORT || 3001

// Initialize Payload
const start = async (): Promise<void> => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET!,
    express: app,
    onInit: () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })

  // Add custom REST API endpoints for Next.js compatibility
  
  // WordPress-compatible pages endpoint
  app.get('/wp-json/next-wp/v1/pages/:slug', async (req, res) => {
    try {
      const { slug } = req.params
      
      const pages = await payload.find({
        collection: 'pages',
        where: {
          slug: {
            equals: slug,
          },
          status: {
            equals: 'published',
          },
        },
        limit: 1,
      })

      if (pages.docs.length === 0) {
        return res.status(404).json({
          success: false,
          error: { message: 'Page not found' },
        })
      }

      const page = pages.docs[0]
      
      // Transform Payload data to match Next.js schema
      const transformedPage = {
        id: page.id,
        slug: page.slug,
        meta: {
          title: page.meta?.title || page.title,
          description: page.meta?.description || '',
          keywords: page.meta?.keywords?.map((k: any) => k.keyword) || [],
        },
        blocks: page.blocks || [],
        template: page.template,
        status: page.status,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
        publishedAt: page.updatedAt,
      }

      res.json({
        success: true,
        data: transformedPage,
      })
    } catch (error) {
      payload.logger.error('Error fetching page:', error)
      res.status(500).json({
        success: false,
        error: { message: 'Internal server error' },
      })
    }
  })

  // WordPress-compatible pages list endpoint
  app.get('/wp-json/next-wp/v1/pages', async (req, res) => {
    try {
      const { template, page = 1, perPage = 10 } = req.query
      
      const where: any = {
        status: {
          equals: 'published',
        },
      }
      
      if (template) {
        where.template = {
          equals: template,
        }
      }

      const pages = await payload.find({
        collection: 'pages',
        where,
        page: parseInt(page as string),
        limit: parseInt(perPage as string),
      })

      const transformedPages = pages.docs.map((page: any) => ({
        id: page.id,
        slug: page.slug,
        meta: {
          title: page.meta?.title || page.title,
          description: page.meta?.description || '',
          keywords: page.meta?.keywords?.map((k: any) => k.keyword) || [],
        },
        blocks: page.blocks || [],
        template: page.template,
        status: page.status,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
        publishedAt: page.updatedAt,
      }))

      res.json({
        success: true,
        data: transformedPages,
      })
    } catch (error) {
      payload.logger.error('Error fetching pages:', error)
      res.status(500).json({
        success: false,
        error: { message: 'Internal server error' },
      })
    }
  })

  // WordPress-compatible site config endpoint
  app.get('/wp-json/next-wp/v1/site-config', async (req, res) => {
    try {
      const siteConfigs = await payload.find({
        collection: 'site-config',
        limit: 1,
      })

      if (siteConfigs.docs.length === 0) {
        return res.status(404).json({
          success: false,
          error: { message: 'Site config not found' },
        })
      }

      const config = siteConfigs.docs[0]
      
      // Transform to match Next.js schema
      const transformedConfig = {
        name: config.name,
        description: config.description,
        url: config.url,
        logo: config.logo,
        favicon: config.favicon,
        defaultMeta: {
          keywords: config.defaultMeta?.keywords?.map((k: any) => k.keyword) || [],
        },
        theme: config.theme || {},
        analytics: config.analytics || {},
        socialLinks: config.socialLinks || [],
      }

      res.json({
        success: true,
        data: transformedConfig,
      })
    } catch (error) {
      payload.logger.error('Error fetching site config:', error)
      res.status(500).json({
        success: false,
        error: { message: 'Internal server error' },
      })
    }
  })

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      time: new Date().toISOString(),
      service: 'payload-cms',
    })
  })

  app.listen(PORT, async () => {
    payload.logger.info(`Server listening on port ${PORT}`)
  })
}

start()
