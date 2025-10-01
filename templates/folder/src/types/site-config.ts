export type FeatureDirection = "ltr" | "rtl";

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
  | "none";

export interface NavigationLink {
  label: string;
  href: string;
}

export interface FeatureItem {
  name: string;
  description: string;
  icon?: IconName;
  href?: string;
}

export interface FeatureHighlightItem {
  title: string;
  description: string;
  imageSrc: string;
  direction: FeatureDirection;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface BentoItem {
  title: string;
  content: string;
  imageSrc: string;
  imageAlt: string;
  fullWidth?: boolean;
  href?: string;
}

export interface BenefitItem {
  id: number;
  text: string;
  image?: string;
}

export interface PricingTier {
  name: string;
  href: string;
  price: string;
  period: string;
  yearlyPrice?: string;
  features: string[];
  description?: string;
  buttonText?: string;
  isPopular?: boolean;
}

export interface FAQItem {
  question: string;
  answerHtml: string;
}

export interface TestimonialItem {
  id: number;
  text: string;
  name: string;
  role?: string;
  image?: string;
}

export interface FooterColumn {
  id: number;
  menu: NavigationLink[];
}

export interface SocialLinks {
  email?: string;
  twitter?: string;
  discord?: string;
  github?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  [key: string]: string | undefined;
}

export interface HeroContent {
  eyebrow?: string;
  title: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  downloadBadges: {
    light: string;
    dark: string;
  };
  showcaseImages: string[];
}

export interface FeatureScrollContent {
  title: string;
  subtitle: string;
  images: string[];
}

export interface CTAContent {
  heading: string;
  subheading: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
}

export interface SiteConfig {
  name: string;
  description: string;
  cta: string;
  url: string;
  keywords: string[];
  links: SocialLinks;
  hero: HeroContent;
  featureScroll: FeatureScrollContent;
  features: FeatureItem[];
  featureHighlight: FeatureHighlightItem[];
  bento: BentoItem[];
  benefits: BenefitItem[];
  pricing: PricingTier[];
  faqs: FAQItem[];
  footer: FooterColumn[];
  testimonials: TestimonialItem[];
  ctaSection: CTAContent;
}
