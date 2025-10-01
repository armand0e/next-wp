import { Header } from "@/components/layout/Header";
import { BlockRenderer } from "@/components/blocks/registry";
import { normalizeBlocks } from "@/lib/content/normalize";
import { fetchPageBySlug, getFallbackPageData } from "@/lib/content/fetcher";
import { notFound } from "next/navigation";

export default async function Home() {
  try {
    // Fetch the home page from WordPress
    const pageData = await fetchPageBySlug("home");
    
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
    console.error("Error loading home page:", error);
    
    // Fallback to default content
    const fallbackPage = getFallbackPageData("home");
    const adaptedBlocks = normalizeBlocks(fallbackPage.blocks);

    return (
      <main className="relative">
        <Header />
        <BlockRenderer blocks={adaptedBlocks} />
      </main>
    );
  }
}
