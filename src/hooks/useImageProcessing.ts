"use client";
import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

// Hook for handling image uploads and processing
export function useImageProcessing() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState<Array<{
    original: string;
    processed: string;
    metadata: {
      width: number;
      height: number;
      format: string;
      objectDetected?: string;
    }
  }>>([]);

  // Process a single image
  const processImage = async (imageFile: File) => {
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await axios.post('/api/process-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        setProcessedImages(prev => [...prev, {
          original: response.data.imageUrl,
          processed: response.data.processedImageUrl,
          metadata: response.data.metadata
        }]);
        
        return {
          success: true,
          imageUrl: response.data.processedImageUrl,
          metadata: response.data.metadata
        };
      } else {
        toast.error(response.data.message || 'Failed to process image');
        return { success: false };
      }
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Error processing image');
      return { success: false };
    } finally {
      setIsProcessing(false);
    }
  };

  // Process multiple images
  const processMultipleImages = async (imageFiles: File[]) => {
    const results = [];
    
    for (const file of imageFiles) {
      const result = await processImage(file);
      if (result.success) {
        results.push(result);
      }
    }
    
    return results;
  };

  // Process a base64 image string
  const processBase64Image = async (base64String: string) => {
    try {
      // Convert base64 to blob
      const response = await fetch(base64String);
      const blob = await response.blob();
      
      // Create a file from the blob
      const file = new File([blob], 'webcam-capture.jpg', { type: 'image/jpeg' });
      
      // Process the file
      return await processImage(file);
    } catch (error) {
      console.error('Error processing base64 image:', error);
      toast.error('Error processing image');
      return { success: false };
    }
  };

  return {
    isProcessing,
    processedImages,
    processImage,
    processMultipleImages,
    processBase64Image,
    clearProcessedImages: () => setProcessedImages([])
  };
}
