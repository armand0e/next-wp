"use client";

import { Icons } from "@/components/icons";
import { Section } from "@/components/section";
import { easeInOutCubic } from "@/lib/animation";
import { motion, useScroll, useTransform } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import type { HeroBlockData } from "@next-wp/content-schema";

interface HeroBlockProps {
  id?: string;
  className?: string;
  data: HeroBlockData;
}

export default function HeroBlock({ id, className, data }: HeroBlockProps) {
  const { scrollY } = useScroll({
    offset: ["start start", "end start"],
  });
  
  const y1 = useTransform(scrollY, [0, 300], [100, 0]);
  const y2 = useTransform(scrollY, [0, 300], [50, 0]);
  const y3 = useTransform(scrollY, [0, 300], [0, 0]);
  const y4 = useTransform(scrollY, [0, 300], [50, 0]);
  const y5 = useTransform(scrollY, [0, 300], [100, 0]);

  const textAlignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <Section
      id={id || "hero"}
      className={cn("relative overflow-hidden", className)}
    >
      {/* Background Image */}
      {data.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={data.backgroundImage.url}
            alt={data.backgroundImage.alt}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}

      <div className={cn(
        "relative z-10 container mx-auto px-4 py-20 md:py-32",
        textAlignmentClasses[data.textAlignment || "center"]
      )}>
        <div className="max-w-4xl mx-auto">
          {/* Eyebrow */}
          {data.eyebrow && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeInOutCubic }}
              className="text-sm font-medium text-muted-foreground mb-4"
            >
              {data.eyebrow}
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: easeInOutCubic }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            {data.title}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: easeInOutCubic }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            {data.description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: easeInOutCubic }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Link
              href={data.primaryCta.href}
              target={data.primaryCta.target}
              rel={data.primaryCta.rel}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "text-white rounded-full group text-lg px-8"
              )}
            >
              {data.primaryCta.label}
            </Link>

            {data.secondaryCta && (
              <Link
                href={data.secondaryCta.href}
                target={data.secondaryCta.target}
                rel={data.secondaryCta.rel}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-full group text-lg px-8"
                )}
              >
                {data.secondaryCta.label}
              </Link>
            )}
          </motion.div>

          {/* Download Badges */}
          {(data.downloadBadges.appStore || data.downloadBadges.googlePlay) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: easeInOutCubic }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              {data.downloadBadges.appStore && (
                <Image
                  src={data.downloadBadges.appStore.url}
                  alt={data.downloadBadges.appStore.alt}
                  width={data.downloadBadges.appStore.width || 150}
                  height={data.downloadBadges.appStore.height || 50}
                  className="h-12 w-auto"
                />
              )}
              
              {data.downloadBadges.googlePlay && (
                <Image
                  src={data.downloadBadges.googlePlay.url}
                  alt={data.downloadBadges.googlePlay.alt}
                  width={data.downloadBadges.googlePlay.width || 150}
                  height={data.downloadBadges.googlePlay.height || 50}
                  className="h-12 w-auto"
                />
              )}
            </motion.div>
          )}
        </div>

        {/* Showcase Images */}
        {data.showcaseImages.length > 0 && (
          <div className="relative max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
              {data.showcaseImages.map((image, index) => {
                const transforms = [y1, y2, y3, y4, y5];
                const yTransform = data.enableParallax ? transforms[index % transforms.length] : undefined;
                
                return (
                  <motion.div
                    key={index}
                    style={yTransform ? { y: yTransform } : undefined}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.5 + (index * 0.1), 
                      ease: easeInOutCubic 
                    }}
                    className="relative"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      width={image.width || 300}
                      height={image.height || 600}
                      className="w-full h-auto max-w-[250px] mx-auto drop-shadow-2xl"
                      priority={index < 2}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
