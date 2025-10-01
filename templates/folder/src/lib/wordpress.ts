/**
 * WordPress REST API Integration
 * Provides utilities for fetching data from a headless WordPress CMS
 */

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://wordpress.armand0e.com';
const WP_API_BASE = `${WORDPRESS_API_URL}/wp-json/wp/v2`;

export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: any;
  categories: number[];
  tags: number[];
  _links: any;
}

export interface WordPressPage {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: any;
  parent: number;
  menu_order: number;
  _links: any;
}

export interface WordPressMedia {
  id: number;
  date: string;
  slug: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  author: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: any;
  description: {
    rendered: string;
  };
  caption: {
    rendered: string;
  };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: {
      [key: string]: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
    };
  };
  source_url: string;
  _links: any;
}

export interface WordPressCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: any;
  _links: any;
}

export interface WordPressTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: any;
  _links: any;
}

/**
 * Generic fetch function for WordPress REST API
 */
async function wpFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${WP_API_BASE}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('WordPress API fetch error:', error);
    throw error;
  }
}

/**
 * Fetch all posts with optional parameters
 */
export async function getPosts(params: {
  per_page?: number;
  page?: number;
  search?: string;
  categories?: number[];
  tags?: number[];
  author?: number;
  orderby?: 'date' | 'id' | 'include' | 'title' | 'slug';
  order?: 'asc' | 'desc';
  status?: 'publish' | 'future' | 'draft' | 'pending' | 'private';
  embed?: boolean;
} = {}): Promise<WordPressPost[]> {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      if (key === 'embed') {
        if (value) {
          searchParams.append('_embed', 'true');
        }
        return;
      }
      if (Array.isArray(value)) {
        searchParams.append(key, value.join(','));
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });

  const endpoint = `/posts${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  return wpFetch<WordPressPost[]>(endpoint);
}

/**
 * Fetch a single post by ID or slug
 */
export async function getPost(idOrSlug: number | string): Promise<WordPressPost> {
  const endpoint = typeof idOrSlug === 'number' ? `/posts/${idOrSlug}` : `/posts?slug=${idOrSlug}`;
  
  if (typeof idOrSlug === 'string') {
    const posts = await wpFetch<WordPressPost[]>(endpoint);
    if (posts.length === 0) {
      throw new Error(`Post with slug "${idOrSlug}" not found`);
    }
    return posts[0];
  }
  
  return wpFetch<WordPressPost>(endpoint);
}

/**
 * Fetch all pages with optional parameters
 */
export async function getPages(params: {
  per_page?: number;
  page?: number;
  search?: string;
  parent?: number;
  slug?: string | string[];
  orderby?: 'date' | 'id' | 'include' | 'title' | 'slug' | 'menu_order';
  order?: 'asc' | 'desc';
  status?: 'publish' | 'future' | 'draft' | 'pending' | 'private';
} = {}): Promise<WordPressPage[]> {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        searchParams.append(key, value.join(','));
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });

  const endpoint = `/pages${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  return wpFetch<WordPressPage[]>(endpoint);
}

/**
 * Fetch a single page by ID or slug
 */
export async function getPage(idOrSlug: number | string): Promise<WordPressPage> {
  const endpoint = typeof idOrSlug === 'number' ? `/pages/${idOrSlug}` : `/pages?slug=${idOrSlug}`;
  
  if (typeof idOrSlug === 'string') {
    const pages = await wpFetch<WordPressPage[]>(endpoint);
    if (pages.length === 0) {
      throw new Error(`Page with slug "${idOrSlug}" not found`);
    }
    return pages[0];
  }
  
  return wpFetch<WordPressPage>(endpoint);
}

/**
 * Fetch media by ID
 */
export async function getMedia(id: number): Promise<WordPressMedia> {
  return wpFetch<WordPressMedia>(`/media/${id}`);
}

/**
 * Fetch multiple media items
 */
export async function getMediaItems(params: {
  per_page?: number;
  page?: number;
  search?: string;
  media_type?: 'image' | 'video' | 'audio' | 'application';
  mime_type?: string;
  orderby?: 'date' | 'id' | 'include' | 'title' | 'slug';
  order?: 'asc' | 'desc';
} = {}): Promise<WordPressMedia[]> {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, value.toString());
    }
  });

  const endpoint = `/media${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  return wpFetch<WordPressMedia[]>(endpoint);
}

/**
 * Fetch categories
 */
export async function getCategories(params: {
  per_page?: number;
  page?: number;
  search?: string;
  slug?: string | string[];
  exclude?: number[];
  include?: number[];
  orderby?: 'id' | 'include' | 'name' | 'slug' | 'term_group' | 'description' | 'count';
  order?: 'asc' | 'desc';
  hide_empty?: boolean;
  parent?: number;
} = {}): Promise<WordPressCategory[]> {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        searchParams.append(key, value.join(','));
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });

  const endpoint = `/categories${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  return wpFetch<WordPressCategory[]>(endpoint);
}

/**
 * Fetch tags
 */
export async function getTags(params: {
  per_page?: number;
  page?: number;
  search?: string;
  slug?: string | string[];
  exclude?: number[];
  include?: number[];
  orderby?: 'id' | 'include' | 'name' | 'slug' | 'term_group' | 'description' | 'count';
  order?: 'asc' | 'desc';
  hide_empty?: boolean;
} = {}): Promise<WordPressTag[]> {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        searchParams.append(key, value.join(','));
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });

  const endpoint = `/tags${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  return wpFetch<WordPressTag[]>(endpoint);
}

/**
 * Helper function to get featured image URL from a post/page
 */
export async function getFeaturedImageUrl(post: WordPressPost | WordPressPage): Promise<string | null> {
  if (!post.featured_media) {
    return null;
  }

  try {
    const media = await getMedia(post.featured_media);
    return media.source_url;
  } catch (error) {
    console.error('Error fetching featured image:', error);
    return null;
  }
}

/**
 * Helper function to strip HTML tags from content
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Helper function to get excerpt from content
 */
export function getExcerpt(content: string, length: number = 150): string {
  const stripped = stripHtml(content);
  return stripped.length > length ? `${stripped.substring(0, length)}...` : stripped;
}
