import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { cloudStorage } from '@payloadcms/plugin-cloud-storage'
import { s3Adapter } from '@payloadcms/plugin-cloud-storage/s3'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Pages } from './collections/Pages.js'
import { SiteConfig } from './collections/SiteConfig.js'
import { Media } from './collections/Media.js'
import { Users } from './collections/Users.js'

// Seed data
import { seed } from './seed/index.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Visual Editor',
      favicon: '/favicon.ico',
      ogImage: '/og-image.jpg',
    },
  },
  collections: [Users, Pages, SiteConfig, Media],
  editor: lexicalEditor({
    features: ({ defaultFeatures }: any) => [
      ...defaultFeatures,
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || 'your-secret-here',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  plugins: [
    cloudStorage({
      collections: {
        media: {
          prefix: 'media',
          adapter: s3Adapter({
            bucket: process.env.STORAGE_BUCKET || 'media',
            config: {
              endpoint: process.env.STORAGE_ENDPOINT,
              credentials: {
                accessKeyId: process.env.STORAGE_ACCESS_KEY || '',
                secretAccessKey: process.env.STORAGE_SECRET_KEY || '',
              },
              region: 'us-east-1',
              forcePathStyle: true,
            },
          }),
        },
      },
    }),
  ],
  globals: [
    {
      slug: 'header',
      fields: [
        {
          name: 'navItems',
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
          ],
        },
      ],
    },
  ],
  // Enable CORS for Next.js app
  cors: [
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'http://localhost:3000',
  ],
  csrf: [
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'http://localhost:3000',
  ],
  onInit: async (payload: any) => {
    if (process.env.NODE_ENV !== 'production') {
      await seed(payload)
    }
  },
})
