/**
 * Block Component Registry
 * Maps block types to their corresponding React components
 */

import dynamic from 'next/dynamic';
import type { BlockType } from '@next-wp/content-schema';
import type { ComponentType } from 'react';
import { externalBlockMap } from './extensions';

// Dynamically import block components for better code splitting
const HeroBlock = dynamic(() => import('./HeroBlock'), { ssr: true });
const FeatureScrollBlock = dynamic(() => import('./FeatureScrollBlock'), { ssr: true });
const FeatureGridBlock = dynamic(() => import('./FeatureGridBlock'), { ssr: true });
const FeatureHighlightBlock = dynamic(() => import('./FeatureHighlightBlock'), { ssr: true });
const BentoGridBlock = dynamic(() => import('./BentoGridBlock'), { ssr: true });
const BenefitsBlock = dynamic(() => import('./BenefitsBlock'), { ssr: true });
const TestimonialsBlock = dynamic(() => import('./TestimonialsBlock'), { ssr: true });
const PricingBlock = dynamic(() => import('./PricingBlock'), { ssr: true });
const FAQBlock = dynamic(() => import('./FAQBlock'), { ssr: true });
const CTABlock = dynamic(() => import('./CTABlock'), { ssr: true });
const FooterBlock = dynamic(() => import('./FooterBlock'), { ssr: true });

// Block component mapping (internal)
const blockComponentMap = {
  'hero': HeroBlock,
  'feature-scroll': FeatureScrollBlock,
  'feature-grid': FeatureGridBlock,
  'feature-highlight': FeatureHighlightBlock,
  'bento-grid': BentoGridBlock,
  'benefits': BenefitsBlock,
  'testimonials': TestimonialsBlock,
  'pricing': PricingBlock,
  'faq': FAQBlock,
  'cta': CTABlock,
  'footer': FooterBlock,
} as const;

// Merge internal and external (developer-extended) block maps
const combinedBlockComponentMap: Partial<Record<BlockType, ComponentType<BlockComponentProps>>> = {
  ...blockComponentMap,
  ...externalBlockMap,
};

// Props interface for all block components
export interface BlockComponentProps {
  id?: string;
  className?: string;
  customCss?: string;
  customId?: string;
  customClasses?: string[];
  [key: string]: any;
}

/**
 * Get block component by type
 */
export function getBlockComponent(blockType: BlockType) {
  return combinedBlockComponentMap[blockType] || null;
}

/**
 * Render block component with props
 */
export function renderBlock(blockType: BlockType, props: BlockComponentProps) {
  const BlockComponent = getBlockComponent(blockType);
  
  if (!BlockComponent) {
    console.warn(`Block component not found for type: ${blockType}`);
    return null;
  }
  
  // Merge custom classes and CSS
  const className = [
    props.className,
    ...(props.customClasses || []),
  ].filter(Boolean).join(' ');
  
  const mergedProps = {
    ...props,
    id: props.customId || props.id,
    className: className || undefined,
  };
  
  return <BlockComponent {...mergedProps} />;
}

/**
 * Dynamic block renderer component
 */
interface DynamicBlockProps extends BlockComponentProps {
  type: BlockType;
}

export function DynamicBlock({ type, ...props }: DynamicBlockProps) {
  return renderBlock(type, props);
}

/**
 * Block renderer for multiple blocks
 */
interface BlockRendererProps {
  blocks: Array<{
    type: BlockType;
    props: BlockComponentProps;
  }>;
  className?: string;
}

export function BlockRenderer({ blocks, className }: BlockRendererProps) {
  return (
    <div className={className}>
      {blocks.map((block, index) => (
        <DynamicBlock
          key={block.props.id || `block-${index}`}
          type={block.type}
          {...block.props}
        />
      ))}
    </div>
  );
}

// Export available block types for reference
export const availableBlockTypes: BlockType[] = Object.keys(combinedBlockComponentMap) as BlockType[];

// Export block map for external use
export { blockComponentMap, combinedBlockComponentMap };
