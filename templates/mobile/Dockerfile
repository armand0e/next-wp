# Multi-stage Dockerfile for templates/mobile
# Works in monorepo by copying the repository root into the build context.

# ---- Builder ----
FROM node:20-alpine AS builder
ENV NODE_ENV=production
WORKDIR /app

# Copy entire repo to ensure local packages (e.g., packages/content-schema) are available
COPY . .

# Install and build only the mobile template
WORKDIR /app/templates/mobile
# Use npm install to allow peer resolution and lockfile update inside container
RUN npm install --no-audit --no-fund \
  && npm run build

# Optional: prune dev deps after build to reduce final image size
RUN npm prune --omit=dev || true

# ---- Runner ----
FROM node:20-alpine AS runner
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app

# Copy built artifacts and runtime deps from builder
COPY --from=builder /app/templates/mobile/.next ./.next
COPY --from=builder /app/templates/mobile/public ./public
COPY --from=builder /app/templates/mobile/package.json ./package.json
COPY --from=builder /app/templates/mobile/next.config.mjs ./next.config.mjs
COPY --from=builder /app/templates/mobile/postcss.config.mjs ./postcss.config.mjs
COPY --from=builder /app/templates/mobile/node_modules ./node_modules

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Bind to 0.0.0.0 to avoid Bad Gateway behind reverse proxies
CMD ["npm", "run", "start", "--", "-p", "3000", "-H", "0.0.0.0"]
