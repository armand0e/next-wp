"use client";

import { Icons } from "@/components/icons";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import { buttonVariants } from "@/components/ui/button";
import { easeInOutCubic } from "@/lib/animation";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { SiteConfig } from "@next-wp/content-schema";

interface HeaderProps {
  siteConfig?: SiteConfig;
  siteName?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function Header({ 
  siteConfig, 
  siteName = "Next WP", 
  ctaLabel = "Get Started",
  ctaHref = "#"
}: HeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [addBorder, setAddBorder] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const controls = useAnimation();

  useEffect(() => {
    let lastScrollY = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY <= lastScrollY);
      setAddBorder(currentScrollY > 20);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    // Set isInitialLoad to false after the component has mounted
    setIsInitialLoad(false);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    controls.start(isVisible ? "visible" : "hidden");
  }, [isVisible, controls]);

  const headerVariants = {
    hidden: { opacity: 0, y: "-100%" },
    visible: { opacity: 1, y: 0 },
  };

  const displayName = siteConfig?.name || siteName;
  const displayCta = ctaLabel;
  const displayCtaHref = ctaHref;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial="hidden"
          animate={controls}
          exit="hidden"
          variants={headerVariants}
          transition={{
            duration: isInitialLoad ? 1 : 0.3,
            delay: isInitialLoad ? 0.5 : 0,
            ease: easeInOutCubic,
          }}
          className={cn("sticky top-0 z-50 p-0 bg-background/60 backdrop-blur")}
        >
          <div className="flex justify-between items-center container mx-auto p-2">
            <Link
              href="/"
              title="brand-logo"
              className="relative mr-6 flex items-center space-x-2"
            >
              {siteConfig?.logo ? (
                <img 
                  src={siteConfig.logo.url} 
                  alt={siteConfig.logo.alt}
                  className="w-auto h-8"
                />
              ) : (
                <Icons.logo className="w-auto h-8" />
              )}
              <span className="font-bold text-xl">{displayName}</span>
            </Link>
            <div className="hidden lg:block">
              <Link
                href={displayCtaHref}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-8 text-white rounded-full group"
                )}
              >
                {displayCta}
              </Link>
            </div>
            <div className="mt-2 cursor-pointer block lg:hidden">
              <MobileDrawer 
                siteName={displayName}
                ctaLabel={displayCta}
                ctaHref={displayCtaHref}
                logo={siteConfig?.logo}
              />
            </div>
          </div>
          <motion.hr
            initial={{ opacity: 0 }}
            animate={{ opacity: addBorder ? 1 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute w-full bottom-0"
          />
        </motion.header>
      )}
    </AnimatePresence>
  );
}
