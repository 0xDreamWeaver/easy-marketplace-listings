"use client";
import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

// Types for the pricing data
export interface PricingData {
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  similarItems: Array<{
    title: string;
    price: number;
    source: string;
    condition?: string;
  }>;
  recommendedPrice: number;
}

// Hook for retrieving pricing data
export function usePricingData() {
  const [isLoading, setIsLoading] = useState(false);
  const [pricingData, setPricingData] = useState<Record<string, PricingData>>({});

  // Get pricing data for an item
  const getPricingData = async (itemType: string, keywords: string[]) => {
    setIsLoading(true);
    
    try {
      const response = await axios.post('/api/pricing-data', {
        itemType,
        keywords
      });
      
      if (response.data.success && response.data.pricing) {
        // Store the pricing data with the item type as the key
        setPricingData(prev => ({
          ...prev,
          [itemType]: response.data.pricing
        }));
        
        return {
          success: true,
          pricing: response.data.pricing
        };
      } else {
        toast.error(response.data.message || 'Failed to retrieve pricing data');
        return { success: false };
      }
    } catch (error) {
      console.error('Error retrieving pricing data:', error);
      toast.error('Error retrieving pricing data');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    pricingData,
    getPricingData,
    clearPricingData: () => setPricingData({})
  };
}
