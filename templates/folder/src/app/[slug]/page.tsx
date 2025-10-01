import { Header } from "@/components/layout/Header";
import { BlockRenderer } from "@/components/blocks/registry";
import { normalizeBlocks } from "@/lib/content/normalize";
import { fetchPageBySlug, getFallbackPageData, getStaticPaths } from "@/lib/content/fetcher";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const paths = await getStaticPaths("mobile");
  return paths.map(path => ({ slug: path.params.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const pageData = await fetchPageBySlug(params.slug);
    
    if (!pageData) {
      return {
        title: "Page Not Found",
        description: "The requested page could not be found.",
      };
    }

    return {
      title: pageData.meta.title,
      description: pageData.meta.description,
      keywords: pageData.meta.keywords,
      openGraph: {
        title: pageData.meta.title,
        description: pageData.meta.description,
        images: pageData.meta.ogImage ? [pageData.meta.ogImage.url] : undefined,
      },
      robots: pageData.meta.noIndex ? "noindex" : undefined,
      alternates: {
        canonical: pageData.meta.canonicalUrl,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
      description: "An error occurred while loading the page.",
    };
  }
}

export default async function Page({ params }: PageProps) {
  try {
    // Fetch the page from WordPress
    const pageData = await fetchPageBySlug(params.slug);
    
    if (!pageData || pageData.status !== "published") {
      notFound();
    }

    // Adapt blocks for rendering
    const adaptedBlocks = normalizeBlocks(pageData.blocks);

    return (
      <main className="relative">
        <Header />
        <BlockRenderer blocks={adaptedBlocks} />
      </main>
    );
  } catch (error) {
    console.error("Error loading page:", error);
    
    // Fallback to default content
    const fallbackPage = getFallbackPageData(params.slug);
    const adaptedFallbackBlocks = normalizeBlocks(fallbackPage.blocks);

    return (
      <main className="relative">
        <Header />
        <BlockRenderer blocks={adaptedFallbackBlocks} />
      </main>
    );
  }
}
