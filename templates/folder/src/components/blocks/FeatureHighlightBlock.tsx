"use client";

import { Section } from "@/components/section";
import { buttonVariants } from "@/components/ui/button";
import { easeOutCubic } from "@/lib/animation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { FeatureHighlightBlockData } from "@next-wp/content-schema";

interface FeatureHighlightBlockProps {
  id?: string;
  className?: string;
  data: FeatureHighlightBlockData;
}

interface FeatureProps {
  feature: FeatureHighlightBlockData['features'][0];
  isActive: boolean;
}

function Feature({ feature, isActive }: FeatureProps) {
  const isLTR = feature.direction === "ltr";
  const textVariants = {
    hidden: { opacity: 0, x: isLTR ? -20 : 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: isLTR ? -10 : 10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: easeOutCubic,
      },
    },
  };

  return (
    <motion.div
      className={cn(
        "flex flex-col items-center justify-between pb-10 transition-all duration-500 ease-out",
        isLTR ? "lg:flex-row" : "lg:flex-row-reverse"
      )}
    >
      <motion.div
        className={cn(
          "w-full lg:w-1/2 mb-10 lg:mb-0",
          isLTR ? "lg:pr-8" : "lg:pl-8"
        )}
        initial="hidden"
        animate={isActive ? "visible" : "hidden"}
        variants={textVariants}
      >
        <div className="flex flex-col gap-4 max-w-sm text-center lg:text-left mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold"
            variants={itemVariants}
          >
            {feature.title}
          </motion.h2>
          <motion.p className="text-xl md:text-2xl text-muted-foreground" variants={itemVariants}>
            {feature.description}
          </motion.p>
          {feature.cta && (
            <motion.div variants={itemVariants}>
              <Link
                href={feature.cta.href}
                target={feature.cta.target}
                rel={feature.cta.rel}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "text-white rounded-full group text-lg",
                  "mx-auto lg:mx-0"
                )}
              >
                {feature.cta.label}
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>
      <div className="w-full lg:w-1/2">
        {feature.image && (
          <Image
            src={feature.image.url}
            alt={feature.image.alt}
            width={feature.image.width || 300}
            height={feature.image.height || 600}
            className="w-full max-w-[300px] mx-auto"
          />
        )}
      </div>
    </motion.div>
  );
}

export default function FeatureHighlightBlock({ id, className, data }: FeatureHighlightBlockProps) {
  const [activeFeature, setActiveFeature] = useState(-1);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!data.enableScrollAnimations) {
      setActiveFeature(0);
      return;
    }

    const handleScroll = () => {
      const container = containerRef.current;
      if (container) {
        const { top, bottom } = container.getBoundingClientRect();
        const middleOfScreen = window.innerHeight / 2;
        const featureHeight = (bottom - top) / data.features.length;

        const activeIndex = Math.floor((middleOfScreen - top) / featureHeight);
        setActiveFeature(
          Math.max(-1, Math.min(data.features.length - 1, activeIndex))
        );
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [data.features.length, data.enableScrollAnimations]);

  return (
    <Section
      id={id || "feature-highlight"}
      title={data.title}
      subtitle={data.subtitle}
      className={cn("container px-10 mx-auto max-w-[var(--max-container-width)]", className)}
      ref={containerRef}
    >
      {data.features.map((feature, index) => (
        <Feature key={feature.id} feature={feature} isActive={activeFeature === index} />
      ))}
    </Section>
  );
}
