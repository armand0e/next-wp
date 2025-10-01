"use client";

import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { BenefitsBlockData } from "@next-wp/content-schema";

interface BenefitsBlockProps {
  id?: string;
  className?: string;
  data: BenefitsBlockData;
}

export default function BenefitsBlock({ id, className, data }: BenefitsBlockProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollPrev = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Auto-play functionality
  useEffect(() => {
    if (!data.autoPlay || !data.enableCarousel) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        
        // If we're at the end, scroll back to the beginning
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollNext();
        }
      }
    }, data.autoPlayDelay || 5000);

    return () => clearInterval(interval);
  }, [data.autoPlay, data.autoPlayDelay, data.enableCarousel]);

  return (
    <Section
      id={id || "benefits"}
      title={data.title}
      subtitle={data.subtitle}
      className={cn("bg-muted relative max-w-screen", className)}
    >
      <div
        ref={scrollContainerRef}
        className={cn(
          "flex gap-4",
          data.enableCarousel
            ? "overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            : "flex-wrap justify-center"
        )}
      >
        {/* Add empty div for extra gap on desktop when carousel is enabled */}
        {data.enableCarousel && (
          <div
            className="hidden md:block flex-shrink-0 w-[calc(90%-1rem)] md:w-1/3 lg:w-1/3 xl:w-1/4 snap-start select-none px-4"
            aria-hidden="true"
          />
        )}
        
        {data.benefits.map((benefit, index) => (
          <div
            key={benefit.id}
            className={cn(
              "select-none px-4",
              data.enableCarousel
                ? "flex-shrink-0 w-[calc(90%-1rem)] md:w-1/3 lg:w-1/3 xl:w-1/4 snap-center md:snap-start"
                : "w-full md:w-1/2 lg:w-1/3 xl:w-1/4"
            )}
          >
            <div className="h-[500px] relative rounded-xl overflow-hidden">
              {benefit.image && (
                <Image
                  src={benefit.image.url}
                  alt={benefit.image.alt}
                  fill
                  className="object-cover transition-all duration-500 ease-out object-[0px_10px] hover:object-top"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-muted to-transparent pointer-events-none" />
            </div>
            <div className="mt-4">
              <h2 className="text-balance text-xl tracking-tight font-semibold leading-[1.25] text-left text-foreground/80 dark:text-foreground/90">
                {benefit.text}
              </h2>
            </div>
          </div>
        ))}
        
        {/* Add empty div for extra gap on desktop when carousel is enabled */}
        {data.enableCarousel && (
          <div
            className="hidden md:block flex-shrink-0 w-1/3 lg:w-1/3 xl:w-1/4 snap-start"
            aria-hidden="true"
          />
        )}
      </div>
      
      {data.enableCarousel && (
        <div className="flex justify-center md:justify-end mt-4 md:mt-8 md:pr-32">
          <div className="flex gap-4">
            <Button
              onClick={scrollPrev}
              className="size-8 rounded-full"
              variant="outline"
              size="icon"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Previous slide</span>
            </Button>
            <Button
              onClick={scrollNext}
              className="size-8 rounded-full"
              variant="outline"
              size="icon"
            >
              <ArrowRight className="h-4 w-4" />
              <span className="sr-only">Next slide</span>
            </Button>
          </div>
        </div>
      )}
    </Section>
  );
}
