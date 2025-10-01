"use client";

import { Section } from "@/components/section";
import { easeInOutCubic } from "@/lib/animation";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { BentoGridBlockData } from "@next-wp/content-schema";

interface BentoGridBlockProps {
  id?: string;
  className?: string;
  data: BentoGridBlockData;
}

export default function BentoGridBlock({ id, className, data }: BentoGridBlockProps) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacities = data.items.map((_, index) =>
    useTransform(
      scrollYProgress,
      [0, 0.1 + index * 0.1, 0.3 + index * 0.1],
      [0, 0, 1],
      { ease: easeInOutCubic }
    )
  );

  const yTransforms = data.items.map((_, index) =>
    useTransform(
      scrollYProgress,
      [0, 0.1 + index * 0.1, 0.3 + index * 0.1],
      [100, 100, 0],
      { ease: easeInOutCubic }
    )
  );

  return (
    <Section
      id={id || "bento"}
      title={data.title}
      subtitle={data.subtitle}
      className={cn("mx-auto max-w-screen-md px-10", className)}
      ref={ref}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.items.map((item, index) => {
          const ItemContent = (
            <motion.div
              style={
                data.enableScrollAnimations
                  ? { opacity: opacities[index], y: yTransforms[index] }
                  : undefined
              }
              className={cn(
                "bg-muted p-4 sm:p-6 !pb-0 rounded-3xl grid grid-rows-1",
                item.fullWidth && "md:col-span-2"
              )}
            >
              <div className="flex flex-col">
                <h2 className="text-xl sm:text-2xl font-bold mb-2 text-foreground">
                  {item.title}
                </h2>
                <p className="text-sm sm:text-base text-foreground mb-4">
                  {item.content}
                </p>
              </div>
              <div
                className={cn(
                  "flex justify-center",
                  item.fullWidth && "sm:space-x-4"
                )}
              >
                {item.image && (
                  <Image
                    src={item.image.url}
                    alt={item.image.alt}
                    width={item.image.width || 400}
                    height={item.image.height || 300}
                    className="w-full h-64 sm:h-96 rounded-xl object-cover object-top"
                  />
                )}
              </div>
            </motion.div>
          );

          return item.link ? (
            <Link
              key={item.id}
              href={item.link.href}
              target={item.link.target}
              rel={item.link.rel}
              className="block hover:scale-[1.02] transition-transform duration-200"
            >
              {ItemContent}
            </Link>
          ) : (
            <div key={item.id}>{ItemContent}</div>
          );
        })}
      </div>
    </Section>
  );
}
