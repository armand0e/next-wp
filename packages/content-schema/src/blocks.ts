/**
 * Shared Content Schema for WordPress Visual Editor + Next.js Templates
 * This schema defines the structure for all blocks that can be created in WordPress
 * and consumed by Next.js components while preserving animations and styling.
 */

// Base types
export type MediaItem = {
  id: number;
  url: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
};

export type LinkItem = {
  label: string;
  href: string;
  target?: "_blank" | "_self";
  rel?: string;
};

export type IconName =
  | "brain"
  | "clock" 
  | "calendar"
  | "cloud"
  | "users"
  | "bell"
  | "shield"
  | "sparkles"
  | "rocket"
  | "zap"
  | "bookmark"
  | "target"
  | "layers"
  | "tablet"
  | "component"
  | "star"
  | "message"
  | "globe"
  | "settings"
  | "list"
  | "heart"
  | "check"
  | "arrow-right"
  | "chevron-right"
  | "none";

// Block-specific data structures
export interface HeroBlockData {
  eyebrow?: string;
  title: string;
  description: string;
  primaryCta: LinkItem;
  secondaryCta?: LinkItem;
  backgroundImage?: MediaItem;
  showcaseImages: MediaItem[];
  downloadBadges: {
    appStore?: MediaItem;
    googlePlay?: MediaItem;
  };
  enableParallax?: boolean;
  textAlignment?: "left" | "center" | "right";
}

export interface FeatureScrollBlockData {
  title: string;
  subtitle: string;
  description?: string;
  images: MediaItem[];
  enableParallax?: boolean;
  animationDelay?: number;
}

export interface FeatureItem {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  link?: LinkItem;
}

export interface FeatureGridBlockData {
  title: string;
  subtitle: string;
  description?: string;
  features: FeatureItem[];
  columns?: 2 | 3 | 4;
  enableAnimations?: boolean;
}

export interface FeatureHighlightItem {
  id: string;
  title: string;
  description: string;
  image: MediaItem;
  direction: "ltr" | "rtl";
  cta?: LinkItem;
}

export interface FeatureHighlightBlockData {
  title: string;
  subtitle: string;
  features: FeatureHighlightItem[];
  enableScrollAnimations?: boolean;
}

export interface BentoItem {
  id: string;
  title: string;
  content: string;
  image: MediaItem;
  fullWidth?: boolean;
  link?: LinkItem;
}

export interface BentoGridBlockData {
  title: string;
  subtitle: string;
  items: BentoItem[];
  enableScrollAnimations?: boolean;
  animationStagger?: number;
}

export interface BenefitItem {
  id: string;
  text: string;
  image: MediaItem;
}

export interface BenefitsBlockData {
  title: string;
  subtitle: string;
  benefits: BenefitItem[];
  enableCarousel?: boolean;
  autoPlay?: boolean;
  autoPlayDelay?: number;
}

export interface TestimonialItem {
  id: string;
  text: string;
  author: {
    name: string;
    role?: string;
    company?: string;
    avatar?: MediaItem;
  };
  rating?: number;
}

export interface TestimonialsBlockData {
  title: string;
  subtitle: string;
  testimonials: TestimonialItem[];
  layout?: "masonry" | "grid" | "carousel";
  enableAnimations?: boolean;
}

export interface PricingTier {
  id: string;
  name: string;
  description?: string;
  price: string;
  period: string;
  yearlyPrice?: string;
  yearlyDiscount?: string;
  features: string[];
  cta: LinkItem;
  isPopular?: boolean;
  badge?: string;
}

export interface PricingBlockData {
  title: string;
  subtitle: string;
  description?: string;
  tiers: PricingTier[];
  enableYearlyToggle?: boolean;
  enableAnimations?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQBlockData {
  title: string;
  subtitle: string;
  description?: string;
  faqs: FAQItem[];
  enableSearch?: boolean;
  defaultOpen?: string[]; // FAQ IDs that should be open by default
}

export interface CTABlockData {
  title: string;
  subtitle?: string;
  description?: string;
  primaryCta: LinkItem;
  secondaryCta?: LinkItem;
  backgroundImage?: MediaItem;
  backgroundType?: "solid" | "gradient" | "image";
  backgroundColor?: string;
  gradientColors?: [string, string];
  enableMarquee?: boolean;
  marqueeItems?: TestimonialItem[];
}

export interface FooterColumn {
  id: string;
  title?: string;
  links: LinkItem[];
}

export interface FooterBlockData {
  logo?: MediaItem;
  tagline?: string;
  description?: string;
  columns: FooterColumn[];
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    github?: string;
    discord?: string;
    youtube?: string;
  };
  copyright?: string;
  bottomLinks?: LinkItem[];
}

// Block definitions
export type BlockType =
  | "hero"
  | "feature-scroll"
  | "feature-grid"
  | "feature-highlight"
  | "bento-grid"
  | "benefits"
  | "testimonials"
  | "pricing"
  | "faq"
  | "cta"
  | "footer";

export interface BaseBlock {
  id: string;
  type: BlockType;
  enabled?: boolean;
  customCss?: string;
  customId?: string;
  customClasses?: string[];
}

export type BlockData =
  | { type: "hero"; data: HeroBlockData }
  | { type: "feature-scroll"; data: FeatureScrollBlockData }
  | { type: "feature-grid"; data: FeatureGridBlockData }
  | { type: "feature-highlight"; data: FeatureHighlightBlockData }
  | { type: "bento-grid"; data: BentoGridBlockData }
  | { type: "benefits"; data: BenefitsBlockData }
  | { type: "testimonials"; data: TestimonialsBlockData }
  | { type: "pricing"; data: PricingBlockData }
  | { type: "faq"; data: FAQBlockData }
  | { type: "cta"; data: CTABlockData }
  | { type: "footer"; data: FooterBlockData };

export interface Block extends BaseBlock {
  data: BlockData["data"];
}

// Page structure
export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: MediaItem;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface PageData {
  id: string;
  slug: string;
  meta: PageMeta;
  blocks: Block[];
  template?: "mobile" | "saas" | "startup";
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// Site-wide configuration
export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  logo?: MediaItem;
  favicon?: MediaItem;
  defaultMeta: Omit<PageMeta, "title" | "description">;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  analytics?: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
    hotjarId?: string;
  };
  integrations?: {
    mailchimp?: string;
    stripe?: string;
    calendly?: string;
  };
}

// API Response types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    total?: number;
    page?: number;
    perPage?: number;
  };
}

export type PageResponse = APIResponse<PageData>;
export type PagesResponse = APIResponse<PageData[]>;
export type SiteConfigResponse = APIResponse<SiteConfig>;

// Validation schemas (for runtime type checking)
export const BLOCK_TYPES: BlockType[] = [
  "hero",
  "feature-scroll", 
  "feature-grid",
  "feature-highlight",
  "bento-grid",
  "benefits",
  "testimonials",
  "pricing",
  "faq",
  "cta",
  "footer"
];

export const ICON_NAMES: IconName[] = [
  "brain", "clock", "calendar", "cloud", "users", "bell",
  "shield", "sparkles", "rocket", "zap", "bookmark", "target",
  "layers", "tablet", "component", "star", "message", "globe",
  "settings", "list", "heart", "check", "arrow-right", "chevron-right", "none"
];

// Helper functions
export function isValidBlockType(type: string): type is BlockType {
  return BLOCK_TYPES.includes(type as BlockType);
}

export function isValidIconName(icon: string): icon is IconName {
  return ICON_NAMES.includes(icon as IconName);
}

export function createEmptyBlock(type: BlockType): Partial<Block> {
  return {
    id: `${type}-${Date.now()}`,
    type,
    enabled: true,
  };
}
