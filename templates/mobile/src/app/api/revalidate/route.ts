import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const WEBHOOK_SECRET = process.env.PAYLOAD_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature
    const body = await request.text();
    const signature = request.headers.get("x-next-wp-signature");
    const webhookSecret = process.env.PAYLOAD_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("PAYLOAD_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 401 }
      );
    }

    // Verify signature
    const expectedSignature = `sha256=${crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex")}`;

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const payload = JSON.parse(body);
    const { action, page } = payload;

    console.log("Received webhook:", { action, page: page?.slug });

    switch (action) {
      case "page_created":
      case "page_updated":
        if (page?.slug) {
          // Revalidate specific page
          revalidatePath(`/${page.slug}`);
          
          // If it's the home page, also revalidate root
          if (page.slug === "home") {
            revalidatePath("/");
          }
          
          console.log(`Revalidated page: ${page.slug}`);
        }
        break;

      case "page_deleted":
        if (page?.slug) {
          // Revalidate the page (will show 404)
          revalidatePath(`/${page.slug}`);
          console.log(`Revalidated deleted page: ${page.slug}`);
        }
        break;

      case "site_config_updated":
        // Revalidate all pages when site config changes
        revalidateTag("site-config");
        revalidatePath("/", "layout");
        console.log("Revalidated site config");
        break;

      case "test":
        console.log("Test webhook received successfully");
        break;

      default:
        console.log(`Unknown webhook action: ${action}`);
    }

    return NextResponse.json({
      success: true,
      action,
      revalidated: true,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Webhook error:", error);
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for webhook verification
export async function GET() {
  return NextResponse.json({
    message: "Next.js Payload CMS Revalidation Webhook",
    status: "active",
    timestamp: new Date().toISOString(),
  });
}
