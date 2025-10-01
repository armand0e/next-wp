import type { Payload } from 'payload'

export const seed = async (payload: Payload): Promise<void> => {
  payload.logger.info('Seeding database...')

  try {
    // Create admin user
    const existingUsers = await payload.find({
      collection: 'users',
      limit: 1,
    })

    if (existingUsers.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: {
          name: 'Admin User',
          email: 'admin@example.com',
          password: 'password123',
          role: 'admin',
        },
      })
      payload.logger.info('Created admin user: admin@example.com / password123')
    }

    // Create site config
    const existingSiteConfig = await payload.find({
      collection: 'site-config',
      limit: 1,
    })

    if (existingSiteConfig.docs.length === 0) {
      await payload.create({
        collection: 'site-config',
        data: {
          name: 'Visual Editor Demo',
          description: 'A modern website built with visual blocks',
          url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          defaultMeta: {
            keywords: [
              { keyword: 'visual editor' },
              { keyword: 'cms' },
              { keyword: 'nextjs' },
              { keyword: 'payload' },
            ],
          },
          theme: {
            primaryColor: '#3b82f6',
            secondaryColor: '#64748b',
            fontFamily: 'Inter, sans-serif',
          },
          socialLinks: [
            {
              platform: 'twitter',
              url: 'https://twitter.com/example',
            },
            {
              platform: 'github',
              url: 'https://github.com/example',
            },
          ],
        },
      })
      payload.logger.info('Created site config')
    }

    // Create demo home page
    const existingPages = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'home',
        },
      },
      limit: 1,
    })

    if (existingPages.docs.length === 0) {
      await payload.create({
        collection: 'pages',
        data: {
          title: 'Home',
          slug: 'home',
          template: 'mobile',
          status: 'published',
          meta: {
            title: 'Visual Editor Demo - Home',
            description: 'Experience the power of visual editing with drag-and-drop blocks',
            keywords: [
              { keyword: 'visual editor' },
              { keyword: 'demo' },
              { keyword: 'home' },
            ],
          },
          blocks: [
            {
              blockType: 'hero',
              eyebrow: 'Welcome to the Future',
              title: 'Visual Editing Made Simple',
              description: 'Create stunning websites with our drag-and-drop visual editor. No coding required.',
              textAlignment: 'center',
              primaryCta: {
                label: 'Get Started',
                href: '#features',
                target: '_self',
              },
              secondaryCta: {
                label: 'Learn More',
                href: '#about',
                target: '_self',
              },
              enableParallax: true,
            },
            {
              blockType: 'feature-grid',
              title: 'Powerful Features',
              subtitle: 'Everything you need to build amazing websites',
              description: 'Our visual editor comes packed with features that make website building a breeze.',
              columns: 3,
              features: [
                {
                  id: 'drag-drop',
                  name: 'Drag & Drop',
                  description: 'Intuitive drag-and-drop interface for building pages visually.',
                  icon: 'component',
                },
                {
                  id: 'responsive',
                  name: 'Responsive Design',
                  description: 'All blocks are mobile-first and fully responsive.',
                  icon: 'tablet',
                },
                {
                  id: 'fast',
                  name: 'Lightning Fast',
                  description: 'Optimized for performance with Next.js and modern web standards.',
                  icon: 'zap',
                },
                {
                  id: 'seo',
                  name: 'SEO Optimized',
                  description: 'Built-in SEO features to help your site rank better.',
                  icon: 'target',
                },
                {
                  id: 'customizable',
                  name: 'Highly Customizable',
                  description: 'Customize every aspect of your site with our flexible system.',
                  icon: 'settings',
                },
                {
                  id: 'secure',
                  name: 'Secure & Reliable',
                  description: 'Enterprise-grade security and reliability you can trust.',
                  icon: 'shield',
                },
              ],
              enableAnimations: true,
            },
            {
              blockType: 'cta',
              title: 'Ready to Get Started?',
              description: 'Join thousands of users who are already building amazing websites with our visual editor.',
              primaryCta: {
                label: 'Start Building',
                href: '/signup',
                target: '_self',
              },
              secondaryCta: {
                label: 'View Examples',
                href: '/examples',
                target: '_self',
              },
              backgroundType: 'gradient',
              gradientColors: {
                from: '#3b82f6',
                to: '#8b5cf6',
              },
            },
          ],
        },
      })
      payload.logger.info('Created demo home page')
    }

    // Create about page
    const existingAboutPage = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'about',
        },
      },
      limit: 1,
    })

    if (existingAboutPage.docs.length === 0) {
      await payload.create({
        collection: 'pages',
        data: {
          title: 'About Us',
          slug: 'about',
          template: 'mobile',
          status: 'published',
          meta: {
            title: 'About Us - Visual Editor Demo',
            description: 'Learn more about our visual editing platform and mission',
            keywords: [
              { keyword: 'about' },
              { keyword: 'company' },
              { keyword: 'mission' },
            ],
          },
          blocks: [
            {
              blockType: 'hero',
              title: 'About Our Mission',
              description: 'We believe that creating beautiful websites should be accessible to everyone, regardless of technical expertise.',
              textAlignment: 'center',
              primaryCta: {
                label: 'Contact Us',
                href: '/contact',
                target: '_self',
              },
              enableParallax: true,
            },
            {
              blockType: 'feature-highlight',
              title: 'Our Story',
              features: [
                {
                  id: 'story-1',
                  title: 'Founded on Innovation',
                  description: 'We started with a simple idea: make web development accessible to everyone through visual tools.',
                  direction: 'left',
                },
                {
                  id: 'story-2',
                  title: 'Growing Community',
                  description: 'Today, thousands of creators use our platform to build stunning websites without code.',
                  direction: 'right',
                },
              ],
              enableScrollAnimations: true,
            },
          ],
        },
      })
      payload.logger.info('Created about page')
    }

    payload.logger.info('Database seeding completed!')
  } catch (error) {
    payload.logger.error('Error seeding database:', error)
    throw error
  }
}
