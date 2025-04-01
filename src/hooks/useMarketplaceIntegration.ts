"use client";
import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

// Types for the marketplace listing
export interface MarketplaceListing {
  title: string;
  description: string;
  price: number;
  condition: string;
  images: string[];
  keywords: string[];
}

export interface MarketplacePostResult {
  marketplace: string;
  success: boolean;
  message: string;
  listingUrl?: string;
  listingId?: string;
  status?: string;
}

// Hook for posting listings to marketplaces
export function useMarketplaceIntegration() {
  const [isPosting, setIsPosting] = useState(false);
  const [postResults, setPostResults] = useState<MarketplacePostResult[]>([]);

  // Post a listing to a single marketplace
  const postToMarketplace = async (marketplace: string, listing: MarketplaceListing) => {
    setIsPosting(true);
    
    try {
      const response = await axios.post('/api/post-listing', {
        marketplace,
        listing
      });
      
      const result: MarketplacePostResult = {
        marketplace,
        ...response.data
      };
      
      setPostResults(prev => [...prev, result]);
      
      if (response.data.success) {
        toast.success(`Successfully posted to ${marketplace}`);
        return {
          success: true,
          ...response.data
        };
      } else {
        toast.error(`Failed to post to ${marketplace}: ${response.data.message}`);
        return { 
          success: false,
          message: response.data.message
        };
      }
    } catch (error) {
      console.error(`Error posting to ${marketplace}:`, error);
      toast.error(`Error posting to ${marketplace}`);
      return { 
        success: false,
        message: 'Error posting listing'
      };
    } finally {
      setIsPosting(false);
    }
  };

  // Post a listing to multiple marketplaces
  const postToMultipleMarketplaces = async (
    marketplaces: string[],
    listing: MarketplaceListing
  ) => {
    const results: MarketplacePostResult[] = [];
    
    for (const marketplace of marketplaces) {
      const result = await postToMarketplace(marketplace, listing);
      results.push({
        marketplace,
        ...result
      });
    }
    
    return results;
  };

  return {
    isPosting,
    postResults,
    postToMarketplace,
    postToMultipleMarketplaces,
    clearPostResults: () => setPostResults([])
  };
}
