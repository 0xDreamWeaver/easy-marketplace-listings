import { createFetch } from '@vercel/fetch';
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import manifestJSON from '__STATIC_CONTENT_MANIFEST';
import { NextRequest, NextResponse } from 'next/server';

const assetManifest = JSON.parse(manifestJSON);

export interface Env {
  DB: D1Database;
  IMAGES: R2Bucket;
  ENVIRONMENT: string;
  OPENAI_API_KEY?: string;
  __STATIC_CONTENT: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // Handle API routes
    if (url.pathname.startsWith('/api/')) {
      // Create a custom fetch that includes auth headers if needed
      const customFetch = createFetch({
        fetch: fetch,
        headers: {
          'x-api-key': env.OPENAI_API_KEY || '',
        },
      });
      
      // Route API requests to the appropriate handler
      if (url.pathname.startsWith('/api/process-image')) {
        return handleProcessImage(request, env);
      } else if (url.pathname.startsWith('/api/generate-listing')) {
        return handleGenerateListing(request, env);
      } else if (url.pathname.startsWith('/api/pricing-data')) {
        return handlePricingData(request, env);
      } else if (url.pathname.startsWith('/api/post-listing')) {
        return handlePostListing(request, env);
      }
      
      // Default API response if no specific handler
      return new Response(JSON.stringify({ error: 'API endpoint not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Serve static assets from KV storage
    try {
      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: assetManifest,
        }
      );
    } catch (error) {
      // If the asset is not found or another error occurs, return the index.html
      // This enables client-side routing for Next.js
      try {
        url.pathname = '/';
        const indexRequest = new Request(url.toString(), request);
        return await getAssetFromKV(
          {
            request: indexRequest,
            waitUntil: ctx.waitUntil.bind(ctx),
          },
          {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            ASSET_MANIFEST: assetManifest,
          }
        );
      } catch (e) {
        return new Response('Not Found', { status: 404 });
      }
    }
  },
};

// API route handlers
async function handleProcessImage(request: Request, env: Env): Promise<Response> {
  // Mock implementation for now
  return new Response(JSON.stringify({
    success: true,
    imageUrl: '/uploads/processed-image.jpg',
    processedImageUrl: '/uploads/processed-image-optimized.jpg',
    metadata: {
      width: 800,
      height: 600,
      format: 'jpeg',
      objectDetected: 'furniture'
    }
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleGenerateListing(request: Request, env: Env): Promise<Response> {
  // Mock implementation for now
  return new Response(JSON.stringify({
    success: true,
    listing: {
      name: 'Vintage Mid-Century Modern Chair',
      description: 'Beautiful vintage chair in excellent condition. Solid wood frame with original upholstery. Perfect for any modern or retro-inspired living space.',
      condition: 'Good',
      price: 120,
      keywords: ['vintage', 'mid-century', 'chair', 'furniture', 'wood']
    }
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handlePricingData(request: Request, env: Env): Promise<Response> {
  // Mock implementation for now
  return new Response(JSON.stringify({
    success: true,
    pricing: {
      averagePrice: 135,
      priceRange: {
        min: 80,
        max: 200
      },
      recommendedPrice: 120,
      similarItems: [
        {
          title: 'Mid-Century Lounge Chair',
          price: 150,
          source: 'Etsy',
          condition: 'Excellent'
        },
        {
          title: 'Vintage Wooden Chair',
          price: 95,
          source: 'eBay',
          condition: 'Good'
        }
      ]
    }
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handlePostListing(request: Request, env: Env): Promise<Response> {
  // Mock implementation for now
  return new Response(JSON.stringify({
    success: true,
    message: 'Listing posted successfully',
    listingUrl: 'https://example.com/listing/123',
    listingId: '123'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
