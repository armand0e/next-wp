# Multi-stage Dockerfile for Payload CMS
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY cms/payload/package.json ./
COPY cms/payload/tsconfig.json ./

# Install dependencies (including devDependencies for build)
RUN npm install

# Copy source code
COPY cms/payload/src ./src

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
ENV NODE_ENV=production
ENV PORT=3001
ENV PAYLOAD_CONFIG_PATH=/app/dist/payload.config.js
WORKDIR /app

# Copy built application and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Create media directory for uploads
RUN mkdir -p media

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the server
CMD ["npm", "run", "start"]
