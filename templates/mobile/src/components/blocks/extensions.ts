import dynamic from 'next/dynamic'
import type { BlockType } from '@next-wp/content-schema'
import type { ComponentType } from 'react'
import type { BlockComponentProps } from './registry'
import { externalRegistryConfig } from './registry.config'

// Build external block map from configuration. This lets developers
// add blocks by editing registry.config.ts instead of core files.
const map: Record<string, ComponentType<BlockComponentProps>> = {}

for (const entry of externalRegistryConfig) {
  // Default to ssr: true for consistent server rendering
  const ssr = entry.ssr ?? true
  // Use dynamic import for better code splitting
  map[entry.type] = dynamic(() => import(/* @vite-ignore */ entry.module), { ssr }) as any
}

export const externalBlockMap: Partial<Record<BlockType, ComponentType<BlockComponentProps>>> = map
