"use client";

import { Section } from "@/components/section";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";
import type { TestimonialsBlockData } from "@next-wp/content-schema";

interface TestimonialsBlockProps {
  id?: string;
  className?: string;
  data: TestimonialsBlockData;
}

export default function TestimonialsBlock({ id, className, data }: TestimonialsBlockProps) {
  const layoutClasses = {
    masonry: "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4",
    grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
    carousel: "flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
  };

  const itemClasses = {
    masonry: "break-inside-avoid",
    grid: "",
    carousel: "flex-shrink-0 w-80 snap-start",
  };

  return (
    <Section
      id={id || "testimonials"}
      title={data.title}
      subtitle={data.subtitle}
      className={cn("container px-10 mx-auto", className)}
    >
      <div className={cn("py-10", layoutClasses[data.layout || "masonry"])}>
        {data.testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={data.enableAnimations ? { opacity: 0, y: 20 } : {}}
            whileInView={data.enableAnimations ? { opacity: 1, y: 0 } : {}}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.5,
              delay: data.layout === "masonry" ? index * 0.1 : 0,
              ease: "easeOut",
            }}
            className={cn(
              "bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200",
              itemClasses[data.layout || "masonry"]
            )}
          >
            {/* Rating */}
            {testimonial.rating && (
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < testimonial.rating!
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    )}
                  />
                ))}
              </div>
            )}

            {/* Testimonial Text */}
            <blockquote className="text-foreground mb-6 leading-relaxed">
              "{testimonial.text}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-3">
              {testimonial.author.avatar && (
                <Image
                  src={testimonial.author.avatar.url}
                  alt={testimonial.author.avatar.alt}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              )}
              <div>
                <div className="font-semibold text-foreground">
                  {testimonial.author.name}
                </div>
                {(testimonial.author.role || testimonial.author.company) && (
                  <div className="text-sm text-muted-foreground">
                    {[testimonial.author.role, testimonial.author.company]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
