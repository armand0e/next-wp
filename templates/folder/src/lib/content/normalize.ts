import type { Block, BlockType } from "@next-wp/content-schema";
import type { BlockComponentProps } from "@/components/blocks/registry";
import { adaptBlock } from "@/lib/content/adapter";

export type AdaptedBlock = Exclude<ReturnType<typeof adaptBlock>, null>;

export type NormalizedBlock = {
  type: BlockType;
  props: BlockComponentProps;
};

function ensureId<T extends BlockComponentProps>(type: BlockType, props: T): T & { id: string } {
  if (props.id) {
    return props as T & { id: string };
  }

  return {
    ...props,
    id: `${type}-${Math.random().toString(36).substr(2, 9)}`,
  };
}

export function normalizeBlocks(blocks: Block[]): NormalizedBlock[] {
  return blocks
    .map((rawBlock: Block) => {
      const adapted = adaptBlock(rawBlock);
      if (!adapted) {
        return null;
      }

      const type = adapted.type as BlockType;
      const baseProps = adapted.props as BlockComponentProps;
      const mergedProps = ensureId(type, {
        ...baseProps,
        id: baseProps.id ?? rawBlock.id ?? `${type}-${Math.random().toString(36).substr(2, 9)}`,
        customId: rawBlock.customId ?? baseProps.customId,
        customClasses: rawBlock.customClasses ?? baseProps.customClasses,
        customCss: rawBlock.customCss ?? baseProps.customCss,
      });

      return {
        type,
        props: mergedProps,
      } as NormalizedBlock;
    })
    .filter((block): block is NormalizedBlock => block !== null);
}
