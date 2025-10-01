import { Header } from "@/components/layout/Header";
import { BlockRenderer } from "@/components/blocks/registry";
import { normalizeBlocks } from "@/lib/content/normalize";
import { fetchPagePreview, getFallbackPageData } from "@/lib/content/fetcher";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

interface PreviewPageProps {
  searchParams: {
    slug?: string;
    token?: string;
  };
}

function PreviewSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-16 bg-gray-200 mb-4"></div>
      <div className="space-y-4">
        <div className="h-64 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-48 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

async function PreviewContent({ slug, token }: { slug: string; token: string }) {
  try {
    // Fetch the preview page from WordPress
    const pageData = await fetchPagePreview(slug, token);
    
    if (!pageData) {
      notFound();
    }

    // Adapt blocks for rendering
    const adaptedBlocks = normalizeBlocks(pageData.blocks);

    return (
      <>
        {/* Preview Banner */}
        <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2 text-center text-sm text-yellow-800">
          <strong>Preview Mode:</strong> You are viewing a draft version of this page.
          <a 
            href={`/${slug}`} 
            className="ml-2 underline hover:no-underline"
          >
            View published version
          </a>
        </div>
        
        <main className="relative">
          <Header />
          <BlockRenderer blocks={adaptedBlocks} />
        </main>
      </>
    );
  } catch (error) {
    console.error("Error loading preview:", error);
    
    // Fallback to default content
    const fallbackPage = getFallbackPageData(slug);
    const adaptedBlocks = normalizeBlocks(fallbackPage.blocks);

    return (
      <>
        <div className="bg-red-100 border-b border-red-200 px-4 py-2 text-center text-sm text-red-800">
          <strong>Preview Error:</strong> Could not load preview. Showing fallback content.
        </div>
        
        <main className="relative">
          <Header />
          <BlockRenderer blocks={adaptedBlocks} />
        </main>
      </>
    );
  }
}

export default function PreviewPage({ searchParams }: PreviewPageProps) {
  const { slug, token } = searchParams;

  // Redirect to home if no slug or token provided
  if (!slug || !token) {
    redirect("/");
  }

  return (
    <Suspense fallback={<PreviewSkeleton />}>
      <PreviewContent slug={slug} token={token} />
    </Suspense>
  );
}
