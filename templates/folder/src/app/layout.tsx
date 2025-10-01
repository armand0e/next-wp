import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { fetchSiteConfig, getFallbackSiteConfig } from "@/lib/content/fetcher";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const siteConfig = await fetchSiteConfig();
    
    return {
      title: {
        template: `%s | ${siteConfig.name}`,
        default: siteConfig.name,
      },
      description: siteConfig.description,
      keywords: siteConfig.defaultMeta.keywords,
      openGraph: {
        title: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        siteName: siteConfig.name,
        type: "website",
        locale: "en_US",
      },
      icons: "/favicon.ico",
      metadataBase: new URL(siteConfig.url),
    };
  } catch (error) {
    console.error("Error fetching site config for metadata:", error);
    const fallbackConfig = getFallbackSiteConfig();
    
    return {
      title: {
        template: `%s | ${fallbackConfig.name}`,
        default: fallbackConfig.name,
      },
      description: fallbackConfig.description,
      keywords: fallbackConfig.defaultMeta.keywords,
      openGraph: {
        title: fallbackConfig.name,
        description: fallbackConfig.description,
        url: fallbackConfig.url,
        siteName: fallbackConfig.name,
        type: "website",
        locale: "en_US",
      },
      icons: "/favicon.ico",
      metadataBase: new URL(fallbackConfig.url),
    };
  }
}

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} ${fontSans.variable}`}
    >
      <body
        className={cn(
          "min-h-screen bg-background antialiased w-full mx-auto scroll-smooth font-sans"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          {children}
          <ThemeToggle />
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
