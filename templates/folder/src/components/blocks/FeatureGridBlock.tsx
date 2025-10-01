"use client";

import { Section } from "@/components/section";
import { DynamicIcon } from "@/components/icons/registry";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import type { FeatureGridBlockData } from "@next-wp/content-schema";

interface FeatureGridBlockProps {
  id?: string;
  className?: string;
  data: FeatureGridBlockData;
}

export default function FeatureGridBlock({ id, className, data }: FeatureGridBlockProps) {
  const gridClasses = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3", 
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <Section
      id={id || "features"}
      title={data.title}
      subtitle={data.subtitle}
      className={cn("max-w-screen-lg mx-auto container px-10", className)}
    >
      {data.description && (
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          {data.description}
        </p>
      )}
      
      <div className={cn(
        "grid gap-6",
        gridClasses[data.columns || 3]
      )}>
        {data.features.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={data.enableAnimations ? { opacity: 0, y: 20 } : {}}
            whileInView={data.enableAnimations ? { opacity: 1, y: 0 } : {}}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: "easeOut",
            }}
            className="group"
          >
            {feature.link ? (
              <Link
                href={feature.link.href}
                target={feature.link.target}
                rel={feature.link.rel}
                className="block p-6 rounded-xl border bg-card hover:bg-accent/50 transition-colors duration-200"
              >
                <FeatureContent feature={feature} />
              </Link>
            ) : (
              <div className="p-6 rounded-xl border bg-card">
                <FeatureContent feature={feature} />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function FeatureContent({ feature }: { feature: FeatureGridBlockData['features'][0] }) {
  return (
    <>
      <div className="flex items-center gap-3 mb-3">
        {feature.icon && (
          <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
            <DynamicIcon 
              name={feature.icon} 
              className="h-6 w-6 text-primary" 
            />
          </div>
        )}
        <h3 className="text-lg font-semibold">{feature.name}</h3>
      </div>
      <p className="text-muted-foreground leading-relaxed">
        {feature.description}
      </p>
    </>
  );
}
