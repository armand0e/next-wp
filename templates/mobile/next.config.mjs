/** @type {import('next').NextConfig} */
import { URL } from 'node:url'

// Build WordPress image remote pattern from env when available
const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL
let wpRemotePattern = []
try {
  if (wpUrl) {
    const u = new URL(wpUrl)
    // Next.js expects protocol without the trailing colon
    const protocol = (u.protocol || 'https:').replace(':', '')
    wpRemotePattern.push({ protocol, hostname: u.hostname })
  }
} catch {}

const nextConfig = {
  transpilePackages: ["geist", "@next-wp/content-schema"],
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: "localhost" },
      { protocol: 'http', hostname: "payload-cms" },
      { protocol: 'http', hostname: "minio" },
      { protocol: 'https', hostname: "randomuser.me" },
      ...wpRemotePattern,
    ],
    formats: ["image/avif", "image/webp"],
  },
}

export default nextConfig;
