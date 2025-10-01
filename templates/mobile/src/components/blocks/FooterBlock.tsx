"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
  InstagramLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
  GitHubLogoIcon,
  DiscordLogoIcon,
} from "@radix-ui/react-icons";
import { Youtube } from "lucide-react";
import type { FooterBlockData } from "@next-wp/content-schema";

interface FooterBlockProps {
  id?: string;
  className?: string;
  data: FooterBlockData;
}

const socialIcons = {
  twitter: TwitterLogoIcon,
  linkedin: LinkedInLogoIcon,
  instagram: InstagramLogoIcon,
  github: GitHubLogoIcon,
  discord: DiscordLogoIcon,
  youtube: Youtube,
};

export default function FooterBlock({ id, className, data }: FooterBlockProps) {
  const activeSocialLinks = Object.entries(data.socialLinks)
    .filter(([_, url]) => url)
    .map(([platform, url]) => ({
      platform,
      url: url!,
      icon: socialIcons[platform as keyof typeof socialIcons],
    }));

  return (
    <footer id={id || "footer"} className={cn("border-t bg-background", className)}>
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              {data.logo && (
                <Image
                  src={data.logo.url}
                  alt={data.logo.alt}
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
              )}
              {data.tagline && (
                <h3 className="text-lg font-bold text-foreground">
                  {data.tagline}
                </h3>
              )}
            </div>
            
            {data.description && (
              <p className="text-muted-foreground mb-6 max-w-sm">
                {data.description}
              </p>
            )}

            {/* Social Links */}
            {activeSocialLinks.length > 0 && (
              <div className="flex gap-4">
                {activeSocialLinks.map(({ platform, url, icon: Icon }) => (
                  <Link
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="sr-only">{platform}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer Columns */}
          {data.columns.map((column) => (
            <div key={column.id}>
              {column.title && (
                <h4 className="font-semibold text-foreground mb-4">
                  {column.title}
                </h4>
              )}
              <ul className="space-y-3">
                {column.links.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      target={link.target}
                      rel={link.rel}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-sm text-muted-foreground">
              {data.copyright || `© ${new Date().getFullYear()} All rights reserved.`}
            </div>

            {/* Bottom Links */}
            {data.bottomLinks && data.bottomLinks.length > 0 && (
              <div className="flex flex-wrap gap-6">
                {data.bottomLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    target={link.target}
                    rel={link.rel}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
