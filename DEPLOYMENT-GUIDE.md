# WordPress Visual Editor Deployment Guide

This guide covers deploying the complete WordPress visual editing system to production.

## 🏗️ Architecture Overview

```
WordPress Instance (Visual Editor) ←→ Next.js Templates (Production Sites)
       ↓                                        ↑
   Custom Plugin                        Webhook Revalidation
       ↓                                        ↑
   Gutenberg Blocks  ←→ REST API ←→ Content Fetching
```

## 📋 Prerequisites

- WordPress instance with admin access
- Next.js hosting platform (Vercel, Netlify, etc.)
- Domain names for your sites
- SSL certificates (recommended)

## 🔧 WordPress Setup

### 1. Install the Plugin

1. **Upload Plugin:**
   ```bash
   # Zip the plugin directory
   cd wordpress-plugin
   zip -r next-wp-blocks.zip next-wp-blocks/
   ```

2. **Install in WordPress:**
   - Go to WordPress Admin → Plugins → Add New
   - Click "Upload Plugin"
   - Select `next-wp-blocks.zip`
   - Activate the plugin

### 2. Configure Plugin Settings

1. **Navigate to Settings:**
   - WordPress Admin → Settings → Next.js WP Blocks

2. **Configure Webhook URLs:**
   ```
   Mobile Template: https://mobile.armand0e.com/api/revalidate
   SaaS Template: https://saas.armand0e.com/api/revalidate
   Startup Template: https://startup.armand0e.com/api/revalidate
   ```

3. **Set Webhook Secrets:**
   - Generate secure random strings for each template
   - Use the same secrets in your Next.js environment variables

### 3. Test Plugin Installation

1. **Create Test Page:**
   - WordPress Admin → Next.js Pages → Add New
   - Add some blocks (Hero, Features, etc.)
   - Save as draft

2. **Verify API Endpoints:**
   ```bash
   curl https://your-wordpress-site.com/wp-json/next-wp/v1/pages
   ```

## 🚀 Next.js Deployment

### 1. Environment Variables

Set these variables in your hosting platform:

```bash
# Required for all templates
NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com
NEXT_PUBLIC_APP_URL=https://your-nextjs-site.com
WORDPRESS_WEBHOOK_SECRET=your-secure-secret-key

# Optional: Analytics and integrations
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### 2. Vercel Deployment

1. **Deploy via Git:**
   ```bash
   # Connect your repository to Vercel
   # Set environment variables in Vercel dashboard
   # Deploy automatically on push
   ```

2. **Configure Build Settings:**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "installCommand": "npm install"
   }
   ```

3. **Set Custom Domains:**
   - mobile.armand0e.com → Mobile template
   - saas.armand0e.com → SaaS template  
   - startup.armand0e.com → Startup template

### 3. Netlify Deployment

1. **Build Settings:**
   ```toml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = ".next"
   
   [build.environment]
     NODE_VERSION = "18"
   ```

2. **Deploy:**
   ```bash
   # Connect repository to Netlify
   # Configure environment variables
   # Set custom domains
   ```

### 4. Other Platforms

**AWS Amplify:**
```yaml
# amplify.yml
version: 1
applications:
  - frontend:
      phases:
        preBuild:
          commands:
            - npm install
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
```

**Docker Deployment:**
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🚢 Dokploy Deployment

### 1. Build & Deploy via Docker Compose

This repository includes a compose file for the mobile template at `templates/mobile/docker-compose.yml` and a `Dockerfile` tailored to the monorepo. Dokploy will build the image from the repository and run it in the `dokploy-network` without host port mapping.

Steps:

1. In Dokploy, create an Application via Git Provider and point it to this repository/branch.
2. Set the Build Path to `templates/mobile`.
3. Configure Environment Variables in Dokploy:
   - `NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com`
   - `NEXT_PUBLIC_APP_URL=https://mobile.yourdomain.com`
   - `WORDPRESS_WEBHOOK_SECRET=your-secure-secret`
4. In the Deploy tab, click Deploy.
5. Generate a Domain in Dokploy for the service and set the internal port to `3000`.

Notes:

- The service listens on `0.0.0.0:3000` in the container.
- The compose file attaches the service to the `dokploy-network` and does not expose host ports (recommended per Dokploy docs).
- A health endpoint is available at `/api/health` for zero-downtime checks.

### 2. Optional: Traefik Labels

If you prefer managing domains via labels, see `templates/mobile/docker-compose.yml` commented labels for Traefik routing.

### 3. Zero-Downtime Health Check

Use Dokploy Swarm Settings healthcheck pointing to `http://localhost:3000/api/health`.

---

## 🔄 Webhook Configuration

### 1. Test Webhook Connectivity

```bash
# Test webhook endpoint
curl -X POST https://your-nextjs-site.com/api/revalidate \
  -H "Content-Type: application/json" \
  -H "X-Next-WP-Signature: sha256=test" \
  -d '{"action": "test", "timestamp": 1234567890}'
```

### 2. Verify Signature Validation

The webhook handler validates requests using HMAC signatures:

```typescript
// Webhook validation in Next.js
const signature = request.headers.get("x-next-wp-signature");
const expectedSignature = `sha256=${crypto
  .createHmac("sha256", webhookSecret)
  .update(body)
  .digest("hex")}`;
```

### 3. Monitor Webhook Logs

- Check WordPress plugin logs for webhook sending
- Monitor Next.js logs for webhook receiving
- Verify ISR revalidation is working

## 📊 Performance Optimization

### 1. ISR Configuration

```typescript
// Enable ISR with appropriate revalidation times
export const revalidate = 60; // Revalidate every minute

// Use cache tags for granular revalidation
{
  next: {
    tags: ["wordpress", "pages", `page-${slug}`],
    revalidate: 3600, // 1 hour default cache
  }
}
```

### 2. Image Optimization

```typescript
// Optimize WordPress images
const optimizedImage = {
  src: wordpressImage.url,
  alt: wordpressImage.alt,
  width: wordpressImage.width,
  height: wordpressImage.height,
  // Enable Next.js image optimization
  placeholder: "blur",
  blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
};
```

### 3. Content Delivery

- Use CDN for static assets
- Enable gzip compression
- Implement proper caching headers
- Optimize bundle sizes

## 🔒 Security Considerations

### 1. WordPress Security

```php
// Restrict REST API access if needed
add_filter('rest_authentication_errors', function($result) {
    if (!is_wp_error($result) && !is_user_logged_in()) {
        return new WP_Error('rest_not_logged_in', 'You are not logged in.', array('status' => 401));
    }
    return $result;
});
```

### 2. Next.js Security

```typescript
// Validate webhook signatures
if (signature !== expectedSignature) {
  return NextResponse.json(
    { error: "Invalid signature" },
    { status: 401 }
  );
}

// Sanitize content from WordPress
const sanitizedContent = DOMPurify.sanitize(wordpressContent);
```

### 3. Environment Security

- Use strong webhook secrets (32+ characters)
- Enable HTTPS for all communications
- Regularly rotate secrets
- Monitor for suspicious webhook activity

## 📈 Monitoring & Analytics

### 1. Error Tracking

```typescript
// Add error tracking to webhook handler
try {
  await revalidatePath(`/${page.slug}`);
} catch (error) {
  console.error('Revalidation failed:', error);
  // Send to error tracking service
}
```

### 2. Performance Monitoring

- Monitor webhook response times
- Track ISR hit/miss ratios
- Measure page load speeds
- Monitor WordPress API response times

### 3. Content Analytics

- Track page view analytics
- Monitor content update frequency
- Measure editor engagement
- Track conversion rates

## 🚨 Troubleshooting

### Common Issues

**1. Webhook Not Firing:**
```bash
# Check WordPress plugin logs
# Verify webhook URL is accessible
# Test with curl command
```

**2. Content Not Updating:**
```bash
# Check ISR revalidation logs
# Verify cache tags are correct
# Test manual revalidation
```

**3. TypeScript Errors:**
```bash
# Rebuild content schema package
cd packages/content-schema && npm run build

# Reinstall dependencies
npm install
```

**4. Build Failures:**
```bash
# Check environment variables
# Verify all dependencies are installed
# Check for TypeScript errors
```

### Debug Mode

Enable debug logging in production:

```typescript
// Enable debug mode
const DEBUG = process.env.NODE_ENV === 'development' || process.env.DEBUG_WEBHOOKS === 'true';

if (DEBUG) {
  console.log('Webhook payload:', payload);
  console.log('Revalidation result:', result);
}
```

## 📚 Additional Resources

- [WordPress REST API Documentation](https://developer.wordpress.org/rest-api/)
- [Next.js ISR Documentation](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)
- [Vercel Deployment Guide](https://vercel.com/docs/deployments)
- [Netlify Deployment Guide](https://docs.netlify.com/site-deploys/create-deploys/)

## 🆘 Support

For deployment issues:

1. Check the troubleshooting section above
2. Review logs from both WordPress and Next.js
3. Test webhook connectivity manually
4. Verify environment variables are set correctly
5. Open an issue in the repository with detailed logs

---

**Happy Deploying! 🚀**
