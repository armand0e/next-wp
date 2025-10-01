# ⚡ Quick Start - 5 Minutes to Deploy

## What You're Deploying

A complete **visual editing CMS** with:
- **Payload CMS** - Wix-like drag & drop editor
- **Next.js 15** - Lightning-fast frontend
- **PostgreSQL** - Database
- **MinIO** - S3-compatible storage
- **Auto-webhooks** - Instant updates

All in **one Docker Compose file**. No manual setup needed.

---

## Prerequisites

- Dokploy server running
- GitHub/GitLab repo with this code
- 2 domains (or subdomains) pointing to your Dokploy server:
  - `cms.yourdomain.com` → Dokploy IP
  - `mobile.yourdomain.com` → Dokploy IP

---

## 3-Step Deploy

### 1️⃣ Generate Secrets (30 seconds)

Run locally:

```bash
openssl rand -base64 48
# Copy output → This is PAYLOAD_SECRET

openssl rand -base64 32
# Copy output → This is PAYLOAD_WEBHOOK_SECRET
```

### 2️⃣ Create in Dokploy (2 minutes)

**A. Create Application**
- Dokploy → New Application → **Compose**
- Repository: `your-github-repo-url`
- Branch: `main`
- Compose Path: `docker-compose.yml`

**B. Set Environment Variables**
```bash
PAYLOAD_SECRET=<paste-48-char-secret>
PAYLOAD_WEBHOOK_SECRET=<paste-32-char-secret>
NEXT_PUBLIC_APP_URL=https://mobile.yourdomain.com
PAYLOAD_PUBLIC_SERVER_URL=https://cms.yourdomain.com
```

**C. Add Domains**
1. `cms.yourdomain.com` → service `payload-cms`, port `3001`
2. `mobile.yourdomain.com` → service `mobile-template`, port `3000`

### 3️⃣ Deploy & Use (2 minutes)

1. Click **Deploy**
2. Wait for ✅ All services healthy
3. Visit `https://cms.yourdomain.com/admin`
4. Create admin account
5. Start building pages! 🎉

---

## What to Do First

### Create Home Page

1. **Collections** → **Pages** → **Create New**
2. **Title**: `Home`
3. **Slug**: `home`
4. **Template**: `mobile`
5. **Add Blocks**:
   - **Hero** → Set title: "Welcome to My Site"
   - **Feature Grid** → Add 3 features
   - **CTA** → Add call-to-action
6. **Status**: `published`
7. **Save**

### View Your Page

Visit: `https://mobile.yourdomain.com/home`

Your page is live! 🚀

---

## Need Help?

**Not loading?**
- Check Dokploy logs for build errors
- Verify all 4 environment variables are set
- Ensure domains point to correct services

**Full documentation:**
- `DEPLOYMENT-CHECKLIST.md` - Step-by-step with screenshots
- `README-VISUAL-EDITOR.md` - Advanced features

---

## What's Next?

- ✅ Configure **Site Config** (logo, colors, theme)
- ✅ Add more pages (about, contact, pricing)
- ✅ Integrate **shadcn/ui** components
- ✅ Add **magicui** animations
- ✅ Set up analytics

You now have an **enterprise-grade visual editor** that's completely free and self-hosted! 🎨
