import { z } from 'zod';
import type { 
  BlockType, 
  IconName, 
  MediaItem, 
  LinkItem, 
  PageData, 
  SiteConfig,
  Block
} from './blocks';

// Base schemas
export const MediaItemSchema = z.object({
  id: z.number(),
  url: z.string().url(),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  caption: z.string().optional(),
});

export const LinkItemSchema = z.object({
  label: z.string(),
  href: z.string(),
  target: z.enum(['_blank', '_self']).optional(),
  rel: z.string().optional(),
});

export const IconNameSchema = z.enum([
  'brain', 'clock', 'calendar', 'cloud', 'users', 'bell',
  'shield', 'sparkles', 'rocket', 'zap', 'bookmark', 'target',
  'layers', 'tablet', 'component', 'star', 'message', 'globe',
  'settings', 'list', 'heart', 'check', 'arrow-right', 'chevron-right', 'none'
]);

// Block data schemas
export const HeroBlockDataSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string(),
  description: z.string(),
  primaryCta: LinkItemSchema,
  secondaryCta: LinkItemSchema.optional(),
  backgroundImage: MediaItemSchema.optional(),
  showcaseImages: z.array(MediaItemSchema),
  downloadBadges: z.object({
    appStore: MediaItemSchema.optional(),
    googlePlay: MediaItemSchema.optional(),
  }),
  enableParallax: z.boolean().optional(),
  textAlignment: z.enum(['left', 'center', 'right']).optional(),
});

export const FeatureScrollBlockDataSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  description: z.string().optional(),
  images: z.array(MediaItemSchema),
  enableParallax: z.boolean().optional(),
  animationDelay: z.number().optional(),
});

export const FeatureItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: IconNameSchema,
  link: LinkItemSchema.optional(),
});

export const FeatureGridBlockDataSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  description: z.string().optional(),
  features: z.array(FeatureItemSchema),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
  enableAnimations: z.boolean().optional(),
});

export const FeatureHighlightItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  image: MediaItemSchema,
  direction: z.enum(['ltr', 'rtl']),
  cta: LinkItemSchema.optional(),
});

export const FeatureHighlightBlockDataSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  features: z.array(FeatureHighlightItemSchema),
  enableScrollAnimations: z.boolean().optional(),
});

export const BentoItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  image: MediaItemSchema,
  fullWidth: z.boolean().optional(),
  link: LinkItemSchema.optional(),
});

export const BentoGridBlockDataSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  items: z.array(BentoItemSchema),
  enableScrollAnimations: z.boolean().optional(),
  animationStagger: z.number().optional(),
});

export const BenefitItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  image: MediaItemSchema,
});

export const BenefitsBlockDataSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  benefits: z.array(BenefitItemSchema),
  enableCarousel: z.boolean().optional(),
  autoPlay: z.boolean().optional(),
  autoPlayDelay: z.number().optional(),
});

export const TestimonialItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  author: z.object({
    name: z.string(),
    role: z.string().optional(),
    company: z.string().optional(),
    avatar: MediaItemSchema.optional(),
  }),
  rating: z.number().min(1).max(5).optional(),
});

export const TestimonialsBlockDataSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  testimonials: z.array(TestimonialItemSchema),
  layout: z.enum(['masonry', 'grid', 'carousel']).optional(),
  enableAnimations: z.boolean().optional(),
});

export const PricingTierSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  price: z.string(),
  period: z.string(),
  yearlyPrice: z.string().optional(),
  yearlyDiscount: z.string().optional(),
  features: z.array(z.string()),
  cta: LinkItemSchema,
  isPopular: z.boolean().optional(),
  badge: z.string().optional(),
});

export const PricingBlockDataSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  description: z.string().optional(),
  tiers: z.array(PricingTierSchema),
  enableYearlyToggle: z.boolean().optional(),
  enableAnimations: z.boolean().optional(),
});

export const FAQItemSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
});

export const FAQBlockDataSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  description: z.string().optional(),
  faqs: z.array(FAQItemSchema),
  enableSearch: z.boolean().optional(),
  defaultOpen: z.array(z.string()).optional(),
});

export const CTABlockDataSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  primaryCta: LinkItemSchema,
  secondaryCta: LinkItemSchema.optional(),
  backgroundImage: MediaItemSchema.optional(),
  backgroundType: z.enum(['solid', 'gradient', 'image']).optional(),
  backgroundColor: z.string().optional(),
  gradientColors: z.tuple([z.string(), z.string()]).optional(),
  enableMarquee: z.boolean().optional(),
  marqueeItems: z.array(TestimonialItemSchema).optional(),
});

export const FooterColumnSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  links: z.array(LinkItemSchema),
});

export const FooterBlockDataSchema = z.object({
  logo: MediaItemSchema.optional(),
  tagline: z.string().optional(),
  description: z.string().optional(),
  columns: z.array(FooterColumnSchema),
  socialLinks: z.object({
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    instagram: z.string().optional(),
    github: z.string().optional(),
    discord: z.string().optional(),
    youtube: z.string().optional(),
  }),
  copyright: z.string().optional(),
  bottomLinks: z.array(LinkItemSchema).optional(),
});

// Block schema
export const BaseBlockSchema = z.object({
  id: z.string(),
  type: z.enum([
    'hero', 'feature-scroll', 'feature-grid', 'feature-highlight',
    'bento-grid', 'benefits', 'testimonials', 'pricing', 'faq', 'cta', 'footer'
  ]),
  enabled: z.boolean().optional(),
  customCss: z.string().optional(),
  customId: z.string().optional(),
  customClasses: z.array(z.string()).optional(),
});

export const BlockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('hero'), data: HeroBlockDataSchema }),
  z.object({ type: z.literal('feature-scroll'), data: FeatureScrollBlockDataSchema }),
  z.object({ type: z.literal('feature-grid'), data: FeatureGridBlockDataSchema }),
  z.object({ type: z.literal('feature-highlight'), data: FeatureHighlightBlockDataSchema }),
  z.object({ type: z.literal('bento-grid'), data: BentoGridBlockDataSchema }),
  z.object({ type: z.literal('benefits'), data: BenefitsBlockDataSchema }),
  z.object({ type: z.literal('testimonials'), data: TestimonialsBlockDataSchema }),
  z.object({ type: z.literal('pricing'), data: PricingBlockDataSchema }),
  z.object({ type: z.literal('faq'), data: FAQBlockDataSchema }),
  z.object({ type: z.literal('cta'), data: CTABlockDataSchema }),
  z.object({ type: z.literal('footer'), data: FooterBlockDataSchema }),
]).and(BaseBlockSchema);

// Page schema
export const PageMetaSchema = z.object({
  title: z.string(),
  description: z.string(),
  keywords: z.array(z.string()).optional(),
  ogImage: MediaItemSchema.optional(),
  canonicalUrl: z.string().url().optional(),
  noIndex: z.boolean().optional(),
});

export const PageDataSchema = z.object({
  id: z.string(),
  slug: z.string(),
  meta: PageMetaSchema,
  blocks: z.array(BlockSchema),
  template: z.enum(['mobile', 'saas', 'startup']).optional(),
  status: z.enum(['draft', 'published', 'archived']),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
});

// Site config schema
export const SiteConfigSchema = z.object({
  name: z.string(),
  description: z.string(),
  url: z.string().url(),
  logo: MediaItemSchema.optional(),
  favicon: MediaItemSchema.optional(),
  defaultMeta: PageMetaSchema.omit({ title: true, description: true }),
  theme: z.object({
    primaryColor: z.string(),
    secondaryColor: z.string(),
    fontFamily: z.string(),
  }),
  analytics: z.object({
    googleAnalyticsId: z.string().optional(),
    facebookPixelId: z.string().optional(),
    hotjarId: z.string().optional(),
  }).optional(),
  integrations: z.object({
    mailchimp: z.string().optional(),
    stripe: z.string().optional(),
    calendly: z.string().optional(),
  }).optional(),
});

// API Response schema
export const APIResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.object({
      code: z.string(),
      message: z.string(),
      details: z.any().optional(),
    }).optional(),
    meta: z.object({
      total: z.number().optional(),
      page: z.number().optional(),
      perPage: z.number().optional(),
    }).optional(),
  });

// Validation functions
export function validateBlock(data: unknown): Block {
  return BlockSchema.parse(data);
}

export function validatePageData(data: unknown): PageData {
  return PageDataSchema.parse(data);
}

export function validateSiteConfig(data: unknown): SiteConfig {
  return SiteConfigSchema.parse(data);
}

export function validateMediaItem(data: unknown): MediaItem {
  return MediaItemSchema.parse(data);
}

export function validateLinkItem(data: unknown): LinkItem {
  return LinkItemSchema.parse(data);
}
