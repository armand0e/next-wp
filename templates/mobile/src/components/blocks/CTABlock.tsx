"use client";

import Marquee from "@/components/ui/marquee";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight, HeartHandshake } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CTABlockData } from "@next-wp/content-schema";

interface CTABlockProps {
  id?: string;
  className?: string;
  data: CTABlockData;
}

type CTATestimonial = NonNullable<CTABlockData["marqueeItems"]>[number];

function TestimonialCard({ testimonial }: { testimonial: CTATestimonial }) {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-[2rem] border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        {testimonial.author.avatar && (
          <Image
            src={testimonial.author.avatar.url}
            alt={testimonial.author.avatar.alt}
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {testimonial.author.name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">
            {[testimonial.author.role, testimonial.author.company]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{testimonial.text}</blockquote>
    </figure>
  );
}

export default function CTABlock({ id, className, data }: CTABlockProps) {
  const backgroundStyle = () => {
    switch (data.backgroundType) {
      case "gradient":
        return data.gradientColors
          ? {
              background: `linear-gradient(135deg, ${data.gradientColors[0]}, ${data.gradientColors[1]})`,
            }
          : {};
      case "image":
        return {};
      case "solid":
      default:
        return data.backgroundColor ? { backgroundColor: data.backgroundColor } : {};
    }
  };

  const firstRow = data.marqueeItems?.slice(0, Math.ceil((data.marqueeItems?.length || 0) / 2)) || [];
  const secondRow = data.marqueeItems?.slice(Math.ceil((data.marqueeItems?.length || 0) / 2)) || [];

  return (
    <section id={id || "cta"} className={className}>
      <div className="py-14">
        <div className="container flex w-full flex-col items-center justify-center p-4 mx-auto max-w-[var(--max-container-width)]">
          <div 
            className="relative flex w-full max-w-[1000px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border p-10 py-14"
            style={backgroundStyle()}
          >
            {/* Background Image */}
            {data.backgroundType === "image" && data.backgroundImage && (
              <div className="absolute inset-0 z-0">
                <Image
                  src={data.backgroundImage.url}
                  alt={data.backgroundImage.alt}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
            )}

            {/* Marquee Background */}
            {data.enableMarquee && data.marqueeItems && data.marqueeItems.length > 0 && (
              <div className="absolute rotate-[35deg]">
                <Marquee pauseOnHover className="[--duration:20s]" repeat={3}>
                  {firstRow.map((testimonial) => (
                    <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                  ))}
                </Marquee>
                <Marquee
                  reverse
                  pauseOnHover
                  className="[--duration:20s]"
                  repeat={3}
                >
                  {secondRow.map((testimonial) => (
                    <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                  ))}
                </Marquee>
                <Marquee pauseOnHover className="[--duration:20s]" repeat={3}>
                  {firstRow.map((testimonial) => (
                    <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                  ))}
                </Marquee>
                <Marquee
                  reverse
                  pauseOnHover
                  className="[--duration:20s]"
                  repeat={3}
                >
                  {secondRow.map((testimonial) => (
                    <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                  ))}
                </Marquee>
              </div>
            )}

            {/* Icon */}
            <div className="z-10 mx-auto size-24 rounded-[2rem] border bg-white/10 p-3 shadow-2xl backdrop-blur-md dark:bg-black/10 lg:size-32">
              <HeartHandshake className="mx-auto size-16 text-black dark:text-white lg:size-24" />
            </div>

            {/* Content */}
            <div className="z-10 mt-4 flex flex-col items-center text-center text-black dark:text-white">
              <h1 className="text-3xl font-bold lg:text-4xl mb-2">
                {data.title}
              </h1>
              
              {data.subtitle && (
                <h2 className="text-xl font-medium mb-2">
                  {data.subtitle}
                </h2>
              )}
              
              {data.description && (
                <p className="mt-2 mb-4 max-w-lg">
                  {data.description}
                </p>
              )}

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link
                  href={data.primaryCta.href}
                  target={data.primaryCta.target}
                  rel={data.primaryCta.rel}
                  className={cn(
                    buttonVariants({
                      size: "lg",
                      variant: "outline",
                    }),
                    "group rounded-[2rem] px-6"
                  )}
                >
                  {data.primaryCta.label}
                  <ChevronRight className="ml-1 size-4 transition-all duration-300 ease-out group-hover:translate-x-1" />
                </Link>

                {data.secondaryCta && (
                  <Link
                    href={data.secondaryCta.href}
                    target={data.secondaryCta.target}
                    rel={data.secondaryCta.rel}
                    className={cn(
                      buttonVariants({
                        size: "lg",
                        variant: "secondary",
                      }),
                      "rounded-[2rem] px-6"
                    )}
                  >
                    {data.secondaryCta.label}
                  </Link>
                )}
              </div>
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-b from-transparent to-white to-70% dark:to-black" />
          </div>
        </div>
      </div>
    </section>
  );
}
