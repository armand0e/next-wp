# 🚀 Dokploy Deployment Checklist

## Before You Start

- [ ] Repository pushed to GitHub/GitLab
- [ ] Dokploy server running and accessible
- [ ] Domain DNS pointing to Dokploy server

---

## Step 1: Generate Secrets

Run these commands locally to generate secure secrets:

```bash
# Payload Secret (copy this)
openssl rand -base64 48

# Webhook Secret (copy this)
openssl rand -base64 32
```

Save these securely - you'll need them in Step 3.

---

## Step 2: Create Compose Application in Dokploy

1. **Go to Dokploy Dashboard** → Applications → **New Application**
2. **Select**: Compose
3. **Fill in**:
   - **Name**: `visual-editor-cms`
   - **Repository URL**: `https://github.com/your-username/next-wp`
   - **Branch**: `main`
   - **Compose Path**: `docker-compose.yml` (root level)
   - **Build Path**: `/` (leave as root)

4. **Click**: Create Application

---

## Step 3: Set Environment Variables

In your Dokploy application, go to **Environment** tab and add:

```bash
PAYLOAD_SECRET=<paste-the-48-char-secret-from-step-1>
PAYLOAD_WEBHOOK_SECRET=<paste-the-32-char-secret-from-step-1>
NEXT_PUBLIC_APP_URL=https://mobile.yourdomain.com
PAYLOAD_PUBLIC_SERVER_URL=https://cms.yourdomain.com
```

**Important**: Replace `yourdomain.com` with your actual domain!

---

## Step 4: Configure Domains

Go to **Domains** tab in Dokploy and add **two domains**:

### Domain 1: CMS Admin
- **Domain**: `cms.yourdomain.com`
- **Service**: `payload-cms`
- **Internal Port**: `3001`
- **Enable**: HTTPS/SSL (automatic via Let's Encrypt)

### Domain 2: Frontend
- **Domain**: `mobile.yourdomain.com` (or `yourdomain.com` for root)
- **Service**: `mobile-template`
- **Internal Port**: `3000`
- **Enable**: HTTPS/SSL (automatic via Let's Encrypt)

---

## Step 5: Verify Network

Ensure the external network exists:

1. Go to Dokploy **Settings** → **Networks**
2. Verify `dokploy-network` exists
3. If not, create it:
   ```bash
   docker network create dokploy-network
   ```

---

## Step 6: Deploy!

1. Go back to your application
2. Click **Deploy** button
3. Watch the build logs
4. Wait for all services to show **Healthy** status (2-3 minutes)

**Services should show**:
- ✅ postgres (healthy)
- ✅ minio (healthy)
- ✅ payload-cms (healthy)
- ✅ mobile-template (healthy)

---

## Step 7: First Login

1. **Visit**: `https://cms.yourdomain.com/admin`
2. **Create admin account**:
   - Email: your-email@example.com
   - Password: choose-strong-password
   - Name: Your Name

3. **You're in!** 🎉

---

## Step 8: Test the System

### Create Your First Page

1. In Payload Admin, go to **Collections** → **Pages**
2. Click **Create New**
3. Fill in:
   - **Title**: Home
   - **Slug**: home
   - **Template**: mobile
   - **Status**: published
4. Add blocks:
   - Drag **Hero Block** → Set title, description, CTA
   - Drag **Feature Grid** → Add 3-6 features
5. Click **Save**

### View Your Page

1. Visit: `https://mobile.yourdomain.com/home`
2. You should see your page with all the blocks!

### Test Webhooks

1. Edit the page in Payload
2. Change the title
3. Click **Save**
4. Refresh your frontend → Changes appear instantly!

---

## Verification Checklist

- [ ] CMS admin loads at `https://cms.yourdomain.com/admin`
- [ ] Can create and login to admin account
- [ ] Can create pages with blocks
- [ ] Frontend displays pages at `https://mobile.yourdomain.com/[slug]`
- [ ] Webhooks work (edits appear instantly)
- [ ] Images upload successfully
- [ ] Health endpoints respond:
  - `https://cms.yourdomain.com/health` → `{"status":"ok"}`
  - `https://mobile.yourdomain.com/api/health` → `{"status":"ok"}`

---

## Troubleshooting

### CMS won't load
```bash
# Check Payload logs
docker logs <payload-cms-container-id>

# Verify PAYLOAD_SECRET is set and long enough (48+ chars)
# Verify DATABASE_URL connects to postgres
```

### Frontend 500 errors
```bash
# Check Next.js logs
docker logs <mobile-template-container-id>

# Verify NEXT_PUBLIC_CMS_URL points to payload-cms service
# Verify payload-cms is healthy before Next.js starts
```

### Webhooks not working
```bash
# Test the endpoint manually
curl https://mobile.yourdomain.com/api/revalidate

# Should return: {"message":"Next.js Payload CMS Revalidation Webhook","status":"active"}

# Verify PAYLOAD_WEBHOOK_SECRET matches in both services
```

### Images won't upload
```bash
# Check MinIO logs
docker logs <minio-container-id>

# Verify minio service is healthy
# Check STORAGE_* environment variables in payload-cms
```

---

## Next Steps

- ✅ Configure Site Config (name, logo, theme)
- ✅ Create more pages (about, contact, etc.)
- ✅ Add custom blocks (shadcn/ui, magicui, etc.)
- ✅ Set up analytics (Google Analytics ID in Site Config)
- ✅ Customize themes and styles
- ✅ Invite team members to CMS

---

## 🎉 You're Ready to Build!

Your visual editing system is now live. Start creating beautiful pages without touching code!

For advanced features and component integration, see `README-VISUAL-EDITOR.md`.
