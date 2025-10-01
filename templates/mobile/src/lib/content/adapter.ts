/**
 * Content Adapter
 * Transforms WordPress block data into props for Next.js components
 */

import type { 
  Block, 
  PageData, 
  SiteConfig as WPSiteConfig,
  IconName,
  MediaItem,
  LinkItem
} from '@next-wp/content-schema';

// Icon mapping
export function getIconComponent(iconName: IconName) {
  const iconMap = {
    brain: 'BrainIcon',
    clock: 'ClockIcon', 
    calendar: 'CalendarIcon',
    cloud: 'CloudIcon',
    users: 'UsersIcon',
    bell: 'BellIcon',
    shield: 'ShieldIcon',
    sparkles: 'SparklesIcon',
    rocket: 'RocketIcon',
    zap: 'ZapIcon',
    bookmark: 'BookmarkIcon',
    target: 'TargetIcon',
    layers: 'LayersIcon',
    tablet: 'TabletIcon',
    component: 'ComponentIcon',
    star: 'StarIcon',
    message: 'MessageIcon',
    globe: 'GlobeIcon',
    settings: 'SettingsIcon',
    list: 'ListIcon',
    heart: 'HeartIcon',
    check: 'CheckIcon',
    'arrow-right': 'ArrowRightIcon',
    'chevron-right': 'ChevronRightIcon',
    none: null,
  };
  
  return iconMap[iconName] || null;
}

// Media item helpers
export function getImageProps(media: MediaItem | undefined) {
  if (!media) return null;
  
  return {
    src: media.url,
    alt: media.alt,
    width: media.width,
    height: media.height,
  };
}

export function getLinkProps(link: LinkItem | undefined) {
  if (!link) return null;
  
  return {
    href: link.href,
    target: link.target || '_self',
    rel: link.rel,
  };
}

// Block data adapters
export function adaptHeroBlock(block: Extract<Block, { type: 'hero' }>) {
  return {
    eyebrow: block.data.eyebrow,
    title: block.data.title,
    description: block.data.description,
    primaryCta: block.data.primaryCta,
    secondaryCta: block.data.secondaryCta,
    backgroundImage: getImageProps(block.data.backgroundImage),
    showcaseImages: block.data.showcaseImages.map(getImageProps).filter(Boolean),
    downloadBadges: {
      appStore: getImageProps(block.data.downloadBadges.appStore),
      googlePlay: getImageProps(block.data.downloadBadges.googlePlay),
    },
    enableParallax: block.data.enableParallax ?? true,
    textAlignment: block.data.textAlignment ?? 'center',
  };
}

export function adaptFeatureScrollBlock(block: Extract<Block, { type: 'feature-scroll' }>) {
  return {
    title: block.data.title,
    subtitle: block.data.subtitle,
    description: block.data.description,
    images: block.data.images.map(getImageProps).filter(Boolean),
    enableParallax: block.data.enableParallax ?? true,
    animationDelay: block.data.animationDelay ?? 0.15,
  };
}

export function adaptFeatureGridBlock(block: Extract<Block, { type: 'feature-grid' }>) {
  return {
    title: block.data.title,
    subtitle: block.data.subtitle,
    description: block.data.description,
    features: block.data.features.map(feature => ({
      id: feature.id,
      name: feature.name,
      description: feature.description,
      icon: getIconComponent(feature.icon),
      link: getLinkProps(feature.link),
    })),
    columns: block.data.columns ?? 3,
    enableAnimations: block.data.enableAnimations ?? true,
  };
}

export function adaptFeatureHighlightBlock(block: Extract<Block, { type: 'feature-highlight' }>) {
  return {
    title: block.data.title,
    subtitle: block.data.subtitle,
    features: block.data.features.map(feature => ({
      id: feature.id,
      title: feature.title,
      description: feature.description,
      image: getImageProps(feature.image),
      direction: feature.direction,
      cta: getLinkProps(feature.cta),
    })),
    enableScrollAnimations: block.data.enableScrollAnimations ?? true,
  };
}

export function adaptBentoGridBlock(block: Extract<Block, { type: 'bento-grid' }>) {
  return {
    title: block.data.title,
    subtitle: block.data.subtitle,
    items: block.data.items.map(item => ({
      id: item.id,
      title: item.title,
      content: item.content,
      image: getImageProps(item.image),
      fullWidth: item.fullWidth ?? false,
      link: getLinkProps(item.link),
    })),
    enableScrollAnimations: block.data.enableScrollAnimations ?? true,
    animationStagger: block.data.animationStagger ?? 0.15,
  };
}

export function adaptBenefitsBlock(block: Extract<Block, { type: 'benefits' }>) {
  return {
    title: block.data.title,
    subtitle: block.data.subtitle,
    benefits: block.data.benefits.map(benefit => ({
      id: benefit.id,
      text: benefit.text,
      image: getImageProps(benefit.image),
    })),
    enableCarousel: block.data.enableCarousel ?? true,
    autoPlay: block.data.autoPlay ?? false,
    autoPlayDelay: block.data.autoPlayDelay ?? 5000,
  };
}

export function adaptTestimonialsBlock(block: Extract<Block, { type: 'testimonials' }>) {
  return {
    title: block.data.title,
    subtitle: block.data.subtitle,
    testimonials: block.data.testimonials.map(testimonial => ({
      id: testimonial.id,
      text: testimonial.text,
      author: {
        name: testimonial.author.name,
        role: testimonial.author.role,
        company: testimonial.author.company,
        avatar: getImageProps(testimonial.author.avatar),
      },
      rating: testimonial.rating,
    })),
    layout: block.data.layout ?? 'masonry',
    enableAnimations: block.data.enableAnimations ?? true,
  };
}

export function adaptPricingBlock(block: Extract<Block, { type: 'pricing' }>) {
  return {
    title: block.data.title,
    subtitle: block.data.subtitle,
    description: block.data.description,
    tiers: block.data.tiers.map(tier => ({
      id: tier.id,
      name: tier.name,
      description: tier.description,
      price: tier.price,
      period: tier.period,
      yearlyPrice: tier.yearlyPrice,
      yearlyDiscount: tier.yearlyDiscount,
      features: tier.features,
      cta: tier.cta,
      isPopular: tier.isPopular ?? false,
      badge: tier.badge,
    })),
    enableYearlyToggle: block.data.enableYearlyToggle ?? false,
    enableAnimations: block.data.enableAnimations ?? true,
  };
}

export function adaptFAQBlock(block: Extract<Block, { type: 'faq' }>) {
  return {
    title: block.data.title,
    subtitle: block.data.subtitle,
    description: block.data.description,
    faqs: block.data.faqs.map(faq => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
    })),
    enableSearch: block.data.enableSearch ?? false,
    defaultOpen: block.data.defaultOpen ?? [],
  };
}

export function adaptCTABlock(block: Extract<Block, { type: 'cta' }>) {
  return {
    title: block.data.title,
    subtitle: block.data.subtitle,
    description: block.data.description,
    primaryCta: block.data.primaryCta,
    secondaryCta: getLinkProps(block.data.secondaryCta),
    backgroundImage: getImageProps(block.data.backgroundImage),
    backgroundType: block.data.backgroundType ?? 'solid',
    backgroundColor: block.data.backgroundColor,
    gradientColors: block.data.gradientColors,
    enableMarquee: block.data.enableMarquee ?? false,
    marqueeItems: block.data.marqueeItems?.map(item => ({
      id: item.id,
      text: item.text,
      author: {
        name: item.author.name,
        role: item.author.role,
        company: item.author.company,
        avatar: getImageProps(item.author.avatar),
      },
      rating: item.rating,
    })) ?? [],
  };
}

export function adaptFooterBlock(block: Extract<Block, { type: 'footer' }>) {
  return {
    logo: getImageProps(block.data.logo),
    tagline: block.data.tagline,
    description: block.data.description,
    columns: block.data.columns.map(column => ({
      id: column.id,
      title: column.title,
      links: column.links,
    })),
    socialLinks: block.data.socialLinks,
    copyright: block.data.copyright,
    bottomLinks: block.data.bottomLinks ?? [],
  };
}

// Main adapter function
export function adaptBlock(block: Block) {
  switch (block.type) {
    case 'hero':
      return { type: 'hero', props: adaptHeroBlock(block) };
    case 'feature-scroll':
      return { type: 'feature-scroll', props: adaptFeatureScrollBlock(block) };
    case 'feature-grid':
      return { type: 'feature-grid', props: adaptFeatureGridBlock(block) };
    case 'feature-highlight':
      return { type: 'feature-highlight', props: adaptFeatureHighlightBlock(block) };
    case 'bento-grid':
      return { type: 'bento-grid', props: adaptBentoGridBlock(block) };
    case 'benefits':
      return { type: 'benefits', props: adaptBenefitsBlock(block) };
    case 'testimonials':
      return { type: 'testimonials', props: adaptTestimonialsBlock(block) };
    case 'pricing':
      return { type: 'pricing', props: adaptPricingBlock(block) };
    case 'faq':
      return { type: 'faq', props: adaptFAQBlock(block) };
    case 'cta':
      return { type: 'cta', props: adaptCTABlock(block) };
    case 'footer':
      return { type: 'footer', props: adaptFooterBlock(block) };
    default:
      return null;
  }
}

// Page adapter
export function adaptPageData(pageData: PageData) {
  return {
    id: pageData.id,
    slug: pageData.slug,
    meta: pageData.meta,
    blocks: pageData.blocks.map(adaptBlock).filter(Boolean),
    template: pageData.template,
    status: pageData.status,
    createdAt: pageData.createdAt,
    updatedAt: pageData.updatedAt,
    publishedAt: pageData.publishedAt,
  };
}

// Legacy site config adapter (for backward compatibility)
export function adaptSiteConfig(wpConfig: WPSiteConfig) {
  // This maintains compatibility with existing components that expect the old siteConfig format
  return {
    name: wpConfig.name,
    description: wpConfig.description,
    url: wpConfig.url,
    logo: getImageProps(wpConfig.logo),
    favicon: getImageProps(wpConfig.favicon),
    theme: wpConfig.theme,
    analytics: wpConfig.analytics,
    integrations: wpConfig.integrations,
  };
}
