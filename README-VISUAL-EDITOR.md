# Visual Editor Setup Guide

## 🎯 What You Get

A complete **Wix-like visual editing experience** with:
- **Payload CMS** - Modern, self-hosted visual editor (no WordPress needed!)
- **Next.js 15** - High-performance frontend with ISR
- **Automated deployment** - One-click Dokploy setup
- **Component marketplace ready** - Easy integration of shadcn/ui, magicui, aceternity, etc.
- **Enterprise-scale** - Free, open-source, unlimited usage
- **All-in-one stack** - Postgres, MinIO, CMS, and frontend in one compose file

## 🚀 Quick Start (Dokploy)

### 1. Deploy the Complete Stack

In Dokploy, create a new **Compose** application:

**Repository Settings:**
- Repository: `your-repo-url`
- Branch: `main`
- Compose File: `docker-compose.yml`

**Environment Variables:**
```bash
# Required
PAYLOAD_SECRET=your-super-long-random-secret-here
PAYLOAD_WEBHOOK_SECRET=your-shared-webhook-secret
NEXT_PUBLIC_APP_URL=https://mobile.yourdomain.com
PAYLOAD_PUBLIC_SERVER_URL=https://cms.yourdomain.com
```

### 2. Set Up Domains

Create two domains in Dokploy:

1. **CMS Admin** (Payload):
   - Domain: `cms.yourdomain.com`
   - Service: `payload-cms`
   - Internal Port: `3001`

2. **Frontend** (Next.js):
   - Domain: `mobile.yourdomain.com`
   - Service: `mobile-template`
   - Internal Port: `3000`

### 3. Deploy & Access

1. Click **Deploy** in Dokploy
2. Wait for all services to be healthy (2-3 minutes)
3. Access your CMS: `https://cms.yourdomain.com/admin`
4. Default login: `admin@example.com` / `password123`
5. View your site: `https://mobile.yourdomain.com`

## 🎨 Using the Visual Editor

### Creating Pages

1. **Go to CMS Admin**: `https://cms.yourdomain.com/admin`
2. **Navigate to Pages** → Add New
3. **Fill in basic info**:
   - Title: "About Us"
   - Slug: "about"
   - Template: "mobile"
   - Status: "published"

4. **Build with blocks**:
   - Drag **Hero Block** → Set title, description, CTAs
   - Add **Feature Grid** → Configure icons, features
   - Add **Testimonials** → Upload customer photos, quotes
   - Add **CTA Block** → Final call-to-action

5. **Save & Publish** → Changes appear instantly on your site!

### Available Blocks

- **Hero** - Main page headers with CTAs and showcase images
- **Feature Grid** - Icon-based feature listings (2-4 columns)
- **Feature Scroll** - Horizontal scrolling image galleries
- **Feature Highlight** - Alternating image/text sections
- **Bento Grid** - Pinterest-style content blocks
- **Benefits** - Carousel of benefits with images
- **Testimonials** - Customer reviews with photos and ratings
- **Pricing** - Pricing tables with monthly/yearly toggle
- **FAQ** - Expandable question/answer sections
- **CTA** - Call-to-action sections with backgrounds
- **Footer** - Site footer with links and social media

### Site Configuration

1. **Go to Site Config** in the CMS
2. **Update branding**:
   - Site name and description
   - Logo and favicon uploads
   - Primary/secondary colors
   - Font family selection

3. **Configure integrations**:
   - Google Analytics ID
   - Social media links
   - Default SEO settings

## 🔧 Adding Component Libraries

### shadcn/ui Integration

1. **Install components** in your local environment:
   ```bash
   cd templates/mobile
   npx shadcn-ui@latest add button card input
   ```

2. **Create block wrapper** at `src/components/blocks/external/ShadcnCardGrid.tsx`:
   ```tsx
   import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
   import type { BlockComponentProps } from '../registry'

   interface ShadcnCardGridProps extends BlockComponentProps {
     data: {
       title: string
       cards: Array<{
         title: string
         content: string
       }>
     }
   }

   export default function ShadcnCardGrid({ data }: ShadcnCardGridProps) {
     return (
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {data.cards.map((card, index) => (
           <Card key={index}>
             <CardHeader>
               <CardTitle>{card.title}</CardTitle>
             </CardHeader>
             <CardContent>
               <p>{card.content}</p>
             </CardContent>
           </Card>
         ))}
       </div>
     )
   }
   ```

3. **Register the block** in `src/components/blocks/registry.config.ts`:
   ```ts
   export const externalRegistryConfig = [
     {
       type: 'shadcn-card-grid' as BlockType,
       module: './external/ShadcnCardGrid',
       ssr: true,
     },
   ]
   ```

4. **Add CMS block definition** in `cms/payload/src/blocks/ShadcnCardGridBlock.ts`:
   ```ts
   import type { Block } from 'payload'

   export const ShadcnCardGridBlock: Block = {
     slug: 'shadcn-card-grid',
     labels: {
       singular: 'Card Grid',
       plural: 'Card Grids',
     },
     fields: [
       {
         name: 'title',
         type: 'text',
         required: true,
       },
       {
         name: 'cards',
         type: 'array',
         fields: [
           { name: 'title', type: 'text', required: true },
           { name: 'content', type: 'textarea', required: true },
         ],
       },
     ],
   }
   ```

5. **Register in Payload** by adding to `cms/payload/src/collections/Pages.ts` blocks array.

### magicui Integration

Follow the same pattern:
1. Install magicui components
2. Create wrapper components in `src/components/blocks/external/`
3. Register in `registry.config.ts`
4. Add Payload block definitions
5. Deploy

## 🔄 How It Works

### Architecture Flow

```
Editor (Payload CMS) → Webhook → Next.js ISR → User sees changes
```

1. **Editor creates/updates** page in Payload CMS
2. **Payload sends webhook** to Next.js `/api/revalidate`
3. **Next.js revalidates** cached pages using ISR tags
4. **Users see changes** instantly without rebuild

### Data Flow

```
Payload Blocks → Schema Validation → Next.js Components → Rendered Page
```

1. **Payload stores** block data as structured JSON
2. **Schema validates** data integrity with Zod
3. **Adapters transform** CMS data to component props
4. **Components render** with Framer Motion animations
5. **ISR caches** pages for performance

## 🛠 Development

### Local Development

```bash
# Start Payload CMS
cd cms/payload
npm install
npm run dev  # http://localhost:3001

# Start Next.js (separate terminal)
cd templates/mobile
npm install
npm run dev  # http://localhost:3000
```

### Environment Variables

Create `.env.local` in `templates/mobile/`:
```bash
NEXT_PUBLIC_CMS_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
PAYLOAD_WEBHOOK_SECRET=your-dev-secret
```

### Adding New Blocks

1. **Create Payload block** in `cms/payload/src/blocks/`
2. **Add to Pages collection** blocks array
3. **Create Next.js component** in `templates/mobile/src/components/blocks/`
4. **Register component** in block registry
5. **Test in CMS** admin interface

## 🚨 Troubleshooting

### Common Issues

**CMS not loading:**
- Check `PAYLOAD_SECRET` is set and long enough (32+ chars)
- Verify database connection (`DATABASE_URL`)
- Check Payload service health in Dokploy

**Webhooks not working:**
- Verify `PAYLOAD_WEBHOOK_SECRET` matches in both services
- Check Next.js service can receive requests from Payload
- Test webhook endpoint: `GET https://mobile.yourdomain.com/api/revalidate`

**Images not loading:**
- Verify MinIO service is running
- Check `STORAGE_*` environment variables
- Ensure MinIO bucket is created and accessible

**Build failures:**
- Check all environment variables are set
- Verify Docker context includes entire repository
- Check TypeScript errors in build logs

### Health Checks

- **Payload CMS**: `https://cms.yourdomain.com/health`
- **Next.js**: `https://mobile.yourdomain.com/api/health`
- **MinIO**: Check Dokploy service status

## 📚 Next Steps

1. **Customize branding** in Site Config
2. **Create your first page** with blocks
3. **Add component libraries** (shadcn, magicui, etc.)
4. **Set up analytics** (Google Analytics, etc.)
5. **Configure domains** and SSL certificates
6. **Scale horizontally** by adding more template variants

## 🎉 You're Ready!

You now have a complete visual editing system that rivals Wix, Webflow, and other commercial platforms - but it's:
- ✅ **Self-hosted** (your data, your control)
- ✅ **Open source** (no vendor lock-in)
- ✅ **Enterprise-scale** (unlimited usage)
- ✅ **Developer-friendly** (extend with any React component)
- ✅ **Performance-optimized** (Next.js 15 + ISR)

Happy building! 🚀
