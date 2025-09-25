# Next.js WordPress Visual Editor

A comprehensive visual editing layer for Next.js templates powered by WordPress. This system allows editors to create and modify pages using drag-and-drop blocks while preserving all animations, performance optimizations, and code enhancements of the original Next.js templates.

## 🎯 Overview

This project provides:
- **WordPress Plugin**: Custom Gutenberg blocks that map to Next.js components
- **Content Schema**: Shared TypeScript definitions between WordPress and Next.js
- **Next.js Templates**: Three production-ready templates (Mobile, SaaS, Startup)
- **Visual Editor**: WordPress-based drag-and-drop interface for page composition
- **Real-time Updates**: Webhook-driven revalidation for instant content updates

## 🏗️ Architecture

```
WordPress (Visual Editor) → REST API → Next.js (Production Site)
       ↓                                        ↑
   Gutenberg Blocks                    Webhook Revalidation
       ↓                                        ↑
   Block Compositions  ←→ Content Schema ←→ React Components
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install content schema package
cd packages/content-schema
npm install
npm run build

# Install mobile template dependencies
cd ../../templates/mobile
npm install
```

### 2. Environment Configuration

Create `.env.local` in each template directory:

```bash
# WordPress API Configuration
NEXT_PUBLIC_WORDPRESS_URL=http://wordpress.armand0e.com
NEXT_PUBLIC_APP_URL=https://mobile.armand0e.com

# Webhook Security
WORDPRESS_WEBHOOK_SECRET=your-secret-key-here
```

### 3. WordPress Plugin Setup

1. Copy the `wordpress-plugin/next-wp-blocks` directory to your WordPress plugins folder
2. Activate the "Next.js WP Blocks" plugin in WordPress admin
3. Configure the webhook URL in WordPress settings

### 4. Run Development Server

```bash
cd templates/mobile
npm run dev
```

## 📁 Project Structure

```
next-wp/
├── packages/
│   └── content-schema/          # Shared TypeScript schema
│       ├── src/
│       │   ├── blocks.ts        # Block type definitions
│       │   ├── validation.ts    # Zod validation schemas
│       │   └── index.ts         # Exports
│       └── package.json
├── wordpress-plugin/
│   └── next-wp-blocks/          # WordPress plugin
│       ├── includes/            # PHP classes
│       ├── assets/              # JS/CSS assets
│       └── next-wp-blocks.php   # Main plugin file
└── templates/
    ├── mobile/                  # Mobile app template
    ├── saas/                    # SaaS landing template
    └── startup/                 # Startup template
```

## 🧩 Available Blocks

### Content Blocks
- **Hero**: Main page header with CTA buttons and showcase images
- **Feature Grid**: Grid layout for feature listings with icons
- **Feature Highlight**: Alternating feature sections with images
- **Testimonials**: Customer testimonials in various layouts
- **Pricing**: Pricing tables with feature comparisons
- **FAQ**: Accordion-style frequently asked questions
- **CTA**: Call-to-action sections with background options

### Layout Blocks
- **Feature Scroll**: Parallax scrolling feature showcase
- **Bento Grid**: Masonry-style content grid
- **Benefits**: Carousel of benefit items
- **Footer**: Site footer with links and social media

## 🔧 Development Workflow

### For Editors (WordPress)
1. Log into WordPress admin
2. Create a new "Next.js Page"
3. Use Gutenberg blocks to compose your page
4. Configure block settings in the sidebar
5. Publish to trigger automatic deployment

### For Developers (Next.js)
1. Create new block components in `src/components/blocks/`
2. Add block definitions to the content schema
3. Register blocks in the WordPress plugin
4. Update the block registry in Next.js

## 🔄 Content Flow

1. **Editor creates page** in WordPress using Gutenberg blocks
2. **WordPress saves** block composition as JSON
3. **Webhook triggers** Next.js revalidation on publish
4. **Next.js fetches** updated content via REST API
5. **Adapter transforms** WordPress data to component props
6. **React renders** blocks with preserved animations

## 🎨 Customization

### Adding New Block Types

1. **Define schema** in `packages/content-schema/src/blocks.ts`:
```typescript
export interface CustomBlockData {
  title: string;
  content: string;
  // ... other fields
}
```

2. **Create React component** in `templates/mobile/src/components/blocks/`:
```typescript
export default function CustomBlock({ data }: { data: CustomBlockData }) {
  return <div>{data.title}</div>;
}
```

3. **Register in WordPress** by adding to the plugin's block registry

### Styling and Animations
All original animations and styling are preserved. Blocks use:
- **Framer Motion** for animations
- **Tailwind CSS** for styling  
- **Radix UI** for accessible components
- **Lucide React** for icons

## 🔐 Security

- **Webhook signatures** verify authentic requests from WordPress
- **Environment variables** protect sensitive configuration
- **Input validation** using Zod schemas prevents malformed data
- **Error boundaries** gracefully handle runtime errors

## 🚀 Deployment

### Next.js Templates
Deploy to any platform supporting Next.js:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Docker containers

### WordPress Instance
Requires WordPress with:
- REST API enabled
- Custom plugin installed
- Webhook configuration

## 📖 API Reference

### WordPress REST Endpoints
- `GET /wp-json/next-wp/v1/pages` - List all pages
- `GET /wp-json/next-wp/v1/pages/{slug}` - Get page by slug
- `POST /wp-json/next-wp/v1/pages` - Create new page
- `PUT /wp-json/next-wp/v1/pages/{slug}` - Update page
- `DELETE /wp-json/next-wp/v1/pages/{slug}` - Delete page

### Next.js API Routes
- `POST /api/revalidate` - Webhook handler for content updates
- `GET /preview` - Preview draft content from WordPress

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions

---

Built with ❤️ for the Next.js and WordPress communities
