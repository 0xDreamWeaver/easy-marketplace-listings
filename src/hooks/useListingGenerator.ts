"use client";
import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

// Types for the listing data
export interface ListingData {
  name: string;
  description: string;
  condition: string;
  price: number;
  keywords: string[];
}

// Hook for generating listing content using LLM
export function useListingGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedListings, setGeneratedListings] = useState<Record<string, ListingData>>({});

  // Generate listing content for an image
  const generateListing = async (imageUrl: string, objectType?: string) => {
    setIsGenerating(true);
    
    try {
      const response = await axios.post('/api/generate-listing', {
        imageUrl,
        objectType
      });
      
      if (response.data.success && response.data.listing) {
        // Store the generated listing with the image URL as the key
        setGeneratedListings(prev => ({
          ...prev,
          [imageUrl]: response.data.listing
        }));
        
        return {
          success: true,
          listing: response.data.listing
        };
      } else {
        toast.error(response.data.message || 'Failed to generate listing');
        return { success: false };
      }
    } catch (error) {
      console.error('Error generating listing:', error);
      toast.error('Error generating listing content');
      return { success: false };
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate listings for multiple images
  const generateMultipleListings = async (
    images: Array<{ url: string; objectType?: string }>
  ) => {
    const results: Record<string, ListingData> = {};
    
    for (const image of images) {
      const result = await generateListing(image.url, image.objectType);
      if (result.success && result.listing) {
        results[image.url] = result.listing;
      }
    }
    
    return results;
  };

  return {
    isGenerating,
    generatedListings,
    generateListing,
    generateMultipleListings,
    clearGeneratedListings: () => setGeneratedListings({})
  };
}
