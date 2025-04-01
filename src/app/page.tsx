"use client";

import React from 'react';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import PhotoCapture from '@/components/PhotoCapture';
import ListingPreview from '@/components/ListingPreview';
import MarketplaceSelection from '@/components/MarketplaceSelection';

// Mock data for static export
const MOCK_ITEMS = [
  {
    id: 'item-1',
    photos: ['/images/item1.jpg'],
    processedPhotos: ['/images/item1-processed.jpg'],
    name: 'Vintage Mid-Century Modern Chair',
    description: 'Beautiful vintage chair in excellent condition. Solid wood frame with original upholstery. Perfect for any modern or retro-inspired living space.',
    condition: 'Good',
    price: 120,
    keywords: ['vintage', 'mid-century', 'chair', 'furniture', 'wood'],
    marketplaces: [],
    status: 'ready',
    objectType: 'furniture',
    pricingData: {
      averagePrice: 135,
      priceRange: {
        min: 80,
        max: 200
      },
      recommendedPrice: 120
    }
  }
];

// Mock API responses
const mockProcessImage = async (base64Image) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    success: true,
    imageUrl: '/images/item1-processed.jpg',
    metadata: {
      width: 800,
      height: 600,
      format: 'jpeg',
      objectDetected: 'furniture'
    }
  };
};

const mockGenerateListing = async () => {
  // Simulate generation delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    success: true,
    listing: {
      name: 'Vintage Mid-Century Modern Chair',
      description: 'Beautiful vintage chair in excellent condition. Solid wood frame with original upholstery. Perfect for any modern or retro-inspired living space.',
      condition: 'Good',
      price: 120,
      keywords: ['vintage', 'mid-century', 'chair', 'furniture', 'wood']
    }
  };
};

const mockGetPricingData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
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
  };
};

const mockPostToMarketplaces = async (marketplaces) => {
  // Simulate posting delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return marketplaces.map(marketplace => ({
    marketplace,
    success: true,
    message: `Successfully posted to ${marketplace}`,
    listingUrl: `https://example.com/${marketplace.toLowerCase()}/listing/123`,
    listingId: '123'
  }));
};

export default function Home() {
  // Application state
  const [step, setStep] = useState('capture');
  const [items, setItems] = useState([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Handle photos taken from the PhotoCapture component
  const handlePhotosTaken = async (photos) => {
    setIsProcessing(true);
    setStep('preview');
    
    try {
      // Process the first photo
      const result = await mockProcessImage(photos[0]);
      
      if (result.success) {
        // Create a placeholder item
        const placeholderItem = {
          id: `item-${Date.now()}`,
          photos: [photos[0]],
          processedPhotos: [result.imageUrl],
          name: 'Processing...',
          description: 'Generating description...',
          condition: 'Analyzing...',
          price: 0,
          keywords: [],
          marketplaces: [],
          status: 'processing',
          objectType: result.metadata?.objectDetected
        };
        
        setItems([placeholderItem]);
        
        // Generate listing content
        const genResult = await mockGenerateListing();
        
        if (genResult.success && genResult.listing) {
          const updatedItem = {
            ...placeholderItem,
            name: genResult.listing.name,
            description: genResult.listing.description,
            condition: genResult.listing.condition,
            price: genResult.listing.price,
            keywords: genResult.listing.keywords,
            status: 'ready'
          };
          
          // Get pricing data
          const priceResult = await mockGetPricingData();
          
          if (priceResult.success && priceResult.pricing) {
            const finalItem = {
              ...updatedItem,
              price: priceResult.pricing.recommendedPrice,
              pricingData: {
                averagePrice: priceResult.pricing.averagePrice,
                priceRange: priceResult.pricing.priceRange,
                recommendedPrice: priceResult.pricing.recommendedPrice
              }
            };
            
            setItems([finalItem]);
          } else {
            setItems([updatedItem]);
          }
        }
      }
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Error processing image');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle editing of listing data
  const handleEditListingData = (field, value) => {
    setItems(prevItems => {
      const updatedItems = [...prevItems];
      const item = { ...updatedItems[currentItemIndex] };
      
      // Update the specified field
      item[field] = value;
      
      updatedItems[currentItemIndex] = item;
      return updatedItems;
    });
  };

  // Handle marketplace selection
  const handleMarketplaceSelection = async (selectedMarketplaces) => {
    // Update the current item with selected marketplaces
    setItems(prevItems => {
      const updatedItems = [...prevItems];
      const item = { ...updatedItems[currentItemIndex] };
      
      item.marketplaces = selectedMarketplaces;
      
      updatedItems[currentItemIndex] = item;
      return updatedItems;
    });
    
    // Show publishing state
    setStep('publishing');
    
    try {
      // Get the current item
      const currentItem = items[currentItemIndex];
      
      // Post to selected marketplaces
      if (currentItem && selectedMarketplaces.length > 0) {
        const results = await mockPostToMarketplaces(selectedMarketplaces);
        
        // Update the item with post results
        setItems(prevItems => {
          const updatedItems = [...prevItems];
          const item = { ...updatedItems[currentItemIndex] };
          
          item.postResults = results;
          item.status = 'published';
          
          updatedItems[currentItemIndex] = item;
          return updatedItems;
        });
        
        // Show success message
        const successCount = results.filter(r => r.success).length;
        if (successCount === selectedMarketplaces.length) {
          toast.success(`Successfully posted to all ${successCount} marketplaces!`);
        } else {
          toast.success(`Posted to ${successCount} out of ${selectedMarketplaces.length} marketplaces`);
        }
      }
    } catch (error) {
      console.error('Error posting to marketplaces:', error);
      toast.error('Error posting to marketplaces');
    }
    
    // Go back to capture step
    setStep('capture');
    setCurrentItemIndex(0);
    setItems([]);
  };

  // Navigate to the next item in preview
  const handleNextItem = () => {
    if (currentItemIndex < items.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    } else {
      setStep('marketplaces');
    }
  };

  // Render the appropriate step
  const renderStep = () => {
    switch (step) {
      case 'capture':
        return (
          <PhotoCapture
            onPhotosTaken={handlePhotosTaken}
            onBack={() => {}} // No back action on first step
          />
        );
      
      case 'preview':
        if (isProcessing || items.length === 0) {
          return (
            <div className="flex flex-col h-full items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Processing your images...</p>
            </div>
          );
        }
        
        const currentItem = items[currentItemIndex];
        
        return (
          <ListingPreview
            onBack={() => setStep('capture')}
            onNext={handleNextItem}
            photo={currentItem?.processedPhotos[0] || currentItem?.photos[0] || ''}
            itemIndex={currentItemIndex + 1}
            totalItems={items.length}
            generatedData={{
              name: currentItem?.name || '',
              description: currentItem?.description || '',
              condition: currentItem?.condition || '',
              price: currentItem?.price || 0
            }}
            onEdit={handleEditListingData}
          />
        );
      
      case 'marketplaces':
        return (
          <MarketplaceSelection
            onBack={() => {
              setCurrentItemIndex(items.length - 1);
              setStep('preview');
            }}
            onSubmit={handleMarketplaceSelection}
            itemName={items[currentItemIndex]?.name || 'Your Item'}
          />
        );
      
      case 'publishing':
        return (
          <div className="flex flex-col h-full items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Publishing your listings...</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <main className="flex min-h-screen flex-col">
      <Toaster position="top-center" />
      {renderStep()}
    </main>
  );
}
