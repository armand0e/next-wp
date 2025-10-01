/**
 * Payload CMS Content Fetcher
 * Fetches page data from Payload CMS and validates it against our schema
 */

import type { PageData, SiteConfig, APIResponse } from '@next-wp/content-schema';
import { validatePageData, validateSiteConfig } from '@next-wp/content-schema';

const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_CMS_URL || process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';
const API_BASE = `${PAYLOAD_API_URL}/wp-json/next-wp/v1`;

/**
 * Fetch with error handling and validation
 */
async function apiFetch<T>(
  endpoint: string,
  validator?: (data: unknown) => T,
  tags?: string[],
  revalidateSeconds: number = 60
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Enable ISR caching
      next: { revalidate: revalidateSeconds, ...(tags ? { tags } : {}) },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const apiResponse: APIResponse<T> = await response.json();
    
    if (!apiResponse.success) {
      throw new Error(apiResponse.error?.message || 'API request failed');
    }

    const data = apiResponse.data;
    
    if (!data) {
      throw new Error('No data returned from API');
    }

    // Validate data if validator provided
    if (validator) {
      return validator(data);
    }

    return data;
  } catch (error) {
    console.error('Payload content fetch error:', error);
    throw error;
  }
}

/**
 * Fetch page by slug from Payload CMS
 */
export async function fetchPageBySlug(slug: string): Promise<PageData> {
  return apiFetch(`/pages/${slug}`, validatePageData, ['pages', `page-${slug}`]);
}

/**
 * Fetch page by ID from Payload CMS
 */
export async function fetchPageById(id: string): Promise<PageData> {
  return apiFetch(`/pages/${id}`, validatePageData, ['pages', `page-id-${id}`]);
}

/**
 * Fetch all pages from Payload CMS
 */
export async function fetchPages(params?: {
  page?: number;
  perPage?: number;
  search?: string;
  template?: 'mobile' | 'saas' | 'startup';
  orderby?: 'date' | 'title' | 'slug';
  order?: 'ASC' | 'DESC';
}): Promise<{ pages: PageData[]; meta: any }> {
  const searchParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
  }

  const endpoint = `/pages${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  
  const tagList = ['pages', params?.template ? `pages-${params.template}` : undefined].filter(Boolean) as string[];
  const response = await apiFetch<PageData[]>(endpoint, undefined, tagList);
  
  return {
    pages: response,
    meta: {}, // Meta will be in response headers
  };
}

/**
 * Fetch site configuration from Payload CMS
 */
export async function fetchSiteConfig(): Promise<SiteConfig> {
  return apiFetch('/site-config', validateSiteConfig, ['site-config'], 300);
}

/**
 * Fetch page for preview (with draft content) from Payload CMS
 */
export async function fetchPagePreview(slug: string, token: string): Promise<PageData> {
  const url = `${API_BASE}/pages/${slug}?preview=true&token=${encodeURIComponent(token)}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Don't cache preview requests
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Preview fetch error: ${response.status} ${response.statusText}`);
    }

    const apiResponse: APIResponse<PageData> = await response.json();
    
    if (!apiResponse.success || !apiResponse.data) {
      throw new Error(apiResponse.error?.message || 'Preview fetch failed');
    }

    return validatePageData(apiResponse.data);
  } catch (error) {
    console.error('Payload preview fetch error:', error);
    throw error;
  }
}

/**
 * Get static paths for all published pages from Payload CMS
 */
export async function getStaticPaths(template?: 'mobile' | 'saas' | 'startup') {
  try {
    const { pages } = await fetchPages({ 
      perPage: 100, // Adjust as needed
      template,
    });
    
    return pages
      .filter(page => page.status === 'published')
      .map(page => ({
        params: { slug: page.slug },
      }));
  } catch (error) {
    console.error('Error fetching static paths from Payload:', error);
    return [];
  }
}

/**
 * Fallback data for when Payload is unavailable
 */
export function getFallbackPageData(slug: string): PageData {
  return {
    id: 'fallback',
    slug,
    meta: {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
      keywords: [],
    },
    blocks: [
      {
        id: 'fallback-hero',
        type: 'hero',
        enabled: true,
        data: {
          title: 'Page Not Found',
          description: 'The page you are looking for could not be found. Please check the URL or try again later.',
          primaryCta: {
            label: 'Go Home',
            href: '/',
            target: '_self',
          },
          showcaseImages: [],
          downloadBadges: {},
        },
      },
    ],
    template: 'mobile',
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Fallback site config
 */
export function getFallbackSiteConfig(): SiteConfig {
  return {
    name: 'Next.js Site',
    description: 'A Next.js site powered by Payload CMS',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    defaultMeta: {
      keywords: ['nextjs', 'payload', 'cms'],
    },
    theme: {
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      fontFamily: 'Inter, sans-serif',
    },
  };
}
