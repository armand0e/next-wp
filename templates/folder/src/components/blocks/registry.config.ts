import type { BlockType } from '@next-wp/content-schema'

/**
 * External Block Registry Config
 *
 * Add entries here to register external blocks (e.g., shadcn/ui, magicui, aceternity, radixui, tweakcn).
 * Each entry dynamically imports the module and exposes it under the given block `type`.
 *
 * Notes:
 * - `type` must match the WordPress Gutenberg block type you use in your editor (and your schema adapter).
 * - `module` should be a path that can be resolved at build time from this project.
 * - Set `ssr: false` only for client-only components that cannot render on the server.
 */
export type ExternalRegistryEntry = {
  type: BlockType
  module: string
  ssr?: boolean
}

export const externalRegistryConfig: ExternalRegistryEntry[] = [
  // Examples:
  // {
  //   type: 'shadcn-card-grid' as BlockType,
  //   module: './external/ShadcnCardGrid',
  //   ssr: true,
  // },
  // {
  //   type: 'magicui-glass-hero' as BlockType,
  //   module: './external/MagicUiGlassHero',
  //   ssr: true,
  // },
]
