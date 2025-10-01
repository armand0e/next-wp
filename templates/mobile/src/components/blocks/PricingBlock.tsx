"use client";

import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { useRef, useState } from "react";
import Link from "next/link";
import type { PricingBlockData } from "@next-wp/content-schema";

interface PricingBlockProps {
  id?: string;
  className?: string;
  data: PricingBlockData;
}

export default function PricingBlock({ id, className, data }: PricingBlockProps) {
  const ref = useRef(null);
  const [isYearly, setIsYearly] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacities = data.tiers.map((_, index) =>
    useTransform(scrollYProgress, [0, 0.1 + index * 0.1, 0.3 + index * 0.1], [0, 0, 1])
  );

  const yTransforms = data.tiers.map((_, index) =>
    useTransform(scrollYProgress, [0, 0.1 + index * 0.1, 0.3 + index * 0.1], [100, 100, 0])
  );

  return (
    <Section
      id={id || "pricing"}
      title={data.title}
      subtitle={data.subtitle}
      className={cn("container px-10 mx-auto max-w-[var(--max-container-width)]", className)}
      ref={ref}
    >
      {data.description && (
        <p className="text-lg text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
          {data.description}
        </p>
      )}

      {/* Yearly Toggle */}
      {data.enableYearlyToggle && (
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4 p-1 bg-muted rounded-full">
            <button
              onClick={() => setIsYearly(false)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                !isYearly
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                isYearly
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Yearly
            </button>
          </div>
        </div>
      )}

      <div className={cn(
        "grid gap-8 max-w-5xl mx-auto py-10",
        data.tiers.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
      )}>
        {data.tiers.map((tier, index) => (
          <motion.div
            key={tier.id}
            style={
              data.enableAnimations
                ? { opacity: opacities[index], y: yTransforms[index] }
                : undefined
            }
            className={cn(
              "relative bg-card border rounded-3xl p-6 shadow-sm",
              tier.isPopular && "border-primary shadow-lg scale-105"
            )}
          >
            {/* Popular Badge */}
            {tier.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  {tier.badge || "Most Popular"}
                </span>
              </div>
            )}

            {/* Plan Name */}
            <h3 className="text-2xl font-semibold mb-2">{tier.name}</h3>
            
            {/* Description */}
            {tier.description && (
              <p className="text-muted-foreground mb-4">{tier.description}</p>
            )}

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-primary">
                  {isYearly && tier.yearlyPrice ? tier.yearlyPrice : tier.price}
                </span>
                <span className="text-muted-foreground">
                  /{isYearly ? "year" : tier.period}
                </span>
              </div>
              {isYearly && tier.yearlyDiscount && (
                <p className="text-sm text-green-600 font-medium mt-1">
                  Save {tier.yearlyDiscount}
                </p>
              )}
            </div>

            {/* Features */}
            <div className="space-y-3 mb-8">
              {tier.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Link
              href={tier.cta.href}
              target={tier.cta.target}
              rel={tier.cta.rel}
              className={cn(
                "w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full font-medium transition-colors",
                tier.isPopular
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {tier.cta.label}
              <ChevronRightIcon className="w-4 h-4" />
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
