import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { existsSync } from 'fs';

// Define the response type
interface ProcessImageResponse {
  success: boolean;
  message: string;
  imageUrl?: string;
  processedImageUrl?: string;
  metadata?: {
    width: number;
    height: number;
    format: string;
    objectDetected?: string;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json({ 
        success: false, 
        message: 'No image file provided' 
      } as ProcessImageResponse, { status: 400 });
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid file type. Only JPEG, PNG, and WebP are supported.' 
      } as ProcessImageResponse, { status: 400 });
    }

    // Generate a unique filename
    const uniqueId = uuidv4();
    const fileExtension = file.type.split('/')[1];
    const fileName = `${uniqueId}.${fileExtension}`;
    const processedFileName = `${uniqueId}_processed.${fileExtension}`;
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Save the original file
    const filePath = join(uploadsDir, fileName);
    await writeFile(filePath, buffer);
    
    // Process the image with sharp
    const processedFilePath = join(uploadsDir, processedFileName);
    
    // Get image metadata
    const metadata = await sharp(buffer).metadata();
    
    // Process image: resize, optimize, and format
    await sharp(buffer)
      .resize({
        width: 1200,
        height: 1200,
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80, progressive: true })
      .toFile(processedFilePath);
    
    // Generate URLs for the images
    const imageUrl = `/uploads/${fileName}`;
    const processedImageUrl = `/uploads/${processedFileName}`;
    
    // In a real app, we would run object detection here
    // For now, we'll just mock this functionality
    const objectDetected = mockObjectDetection(metadata.format || '');

    return NextResponse.json({
      success: true,
      message: 'Image processed successfully',
      imageUrl,
      processedImageUrl,
      metadata: {
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: metadata.format || fileExtension,
        objectDetected
      }
    } as ProcessImageResponse);
    
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error processing image' 
    } as ProcessImageResponse, { status: 500 });
  }
}

// Mock function to simulate object detection
function mockObjectDetection(format: string): string {
  // In a real app, this would use a machine learning model
  const possibleObjects = [
    'furniture', 'electronics', 'clothing', 
    'kitchenware', 'toy', 'book', 'jewelry',
    'artwork', 'tool', 'sports equipment'
  ];
  
  // Randomly select an object type
  const randomIndex = Math.floor(Math.random() * possibleObjects.length);
  return possibleObjects[randomIndex];
}
