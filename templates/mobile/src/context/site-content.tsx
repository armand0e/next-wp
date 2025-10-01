"use client";

import { createContext, useContext, ReactNode } from "react";
import type { SiteConfig } from "@/types/site-config";

const SiteContentContext = createContext<SiteConfig | null>(null);

interface SiteContentProviderProps {
  value: SiteConfig;
  children: ReactNode;
}

export function SiteContentProvider({ value, children }: SiteContentProviderProps) {
  return (
    <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);

  if (!context) {
    throw new Error("useSiteContent must be used within a SiteContentProvider");
  }

  return context;
}
