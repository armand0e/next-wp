"use client";

import { Section } from "@/components/section";
import { easeOutCubic } from "@/lib/animation";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { FeatureScrollBlockData } from "@next-wp/content-schema";

interface FeatureScrollBlockProps {
  id?: string;
  className?: string;
  data: FeatureScrollBlockData;
}

export default function FeatureScrollBlock({ id, className, data }: FeatureScrollBlockProps) {
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Create scroll progress for each image
  const scrollProgresses = data.images.map((_, index) => {
    const ref = imageRefs.current[index];
    return useScroll({
      target: ref as any,
      offset: ["start end", "end start"],
    });
  });

  // Create transforms for each image with staggered delays
  const yTransforms = scrollProgresses.map((progress, index) => {
    const delay = index * (data.animationDelay || 0.15);
    const offset = 150 + (index * 50); // Stagger the initial offset
    
    return useTransform(
      progress.scrollYProgress, 
      [0, 0.3 + delay, 0.7 + delay, 1], 
      [offset, offset, 0, -50], 
      {
        ease: easeOutCubic,
      }
    );
  });

  return (
    <Section
      id={id || "feature-scroll"}
      title={data.title}
      subtitle={data.subtitle}
      className={cn("container px-4 sm:px-10 mx-auto max-w-[var(--max-container-width)]", className)}
    >
      {data.description && (
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          {data.description}
        </p>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto select-none">
        {data.images.map((image, index) => (
          <motion.div
            key={index}
            ref={(el) => { imageRefs.current[index] = el; }}
            style={data.enableParallax ? { y: yTransforms[index] } : undefined}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.6,
              delay: index * (data.animationDelay || 0.15),
              ease: easeOutCubic,
            }}
            className="relative"
          >
            <Image
              src={image.url}
              alt={image.alt}
              width={image.width || 300}
              height={image.height || 600}
              className="w-full h-auto -z-10 max-w-[250px] sm:max-w-[300px] mx-auto drop-shadow-2xl rounded-2xl"
              priority={index < 3}
            />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
