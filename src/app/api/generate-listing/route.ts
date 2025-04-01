import { Configuration, OpenAIApi } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

// Define the request and response types
interface GenerateListingRequest {
  imageUrl: string;
  objectType?: string;
}

interface GenerateListingResponse {
  success: boolean;
  message: string;
  listing?: {
    name: string;
    description: string;
    condition: string;
    price: number;
    keywords: string[];
  };
}

// Initialize OpenAI configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured');
      return NextResponse.json({
        success: false,
        message: 'OpenAI API key is not configured'
      } as GenerateListingResponse, { status: 500 });
    }

    // Parse request body
    const body = await request.json() as GenerateListingRequest;
    
    if (!body.imageUrl) {
      return NextResponse.json({
        success: false,
        message: 'Image URL is required'
      } as GenerateListingResponse, { status: 400 });
    }

    // In a real application, we would use the Vision API to analyze the image
    // For this demo, we'll use the objectType if provided, or generate mock data
    
    // Mock implementation for demonstration
    if (!body.objectType) {
      // If no object type is provided, use mock data
      return NextResponse.json({
        success: true,
        message: 'Listing generated successfully',
        listing: generateMockListing('unknown item')
      } as GenerateListingResponse);
    }

    // Generate a prompt for the LLM based on the object type
    const prompt = `
      Generate a detailed marketplace listing for a ${body.objectType} based on an image analysis.
      Include:
      1. A catchy title/name (max 60 characters)
      2. A detailed description (150-200 words) highlighting features, condition, and selling points
      3. Condition assessment (New, Like New, Excellent, Good, Fair, or Poor)
      4. A reasonable price estimate in USD
      5. 5-7 relevant keywords for search optimization
      
      Format the response as JSON with the following structure:
      {
        "name": "Product Name",
        "description": "Detailed description...",
        "condition": "Condition assessment",
        "price": 99.99,
        "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
      }
    `;

    // In a real application, we would call the OpenAI API here
    // For this demo, we'll generate mock data based on the object type
    const listing = generateMockListing(body.objectType);

    return NextResponse.json({
      success: true,
      message: 'Listing generated successfully',
      listing
    } as GenerateListingResponse);
    
  } catch (error) {
    console.error('Error generating listing:', error);
    return NextResponse.json({
      success: false,
      message: 'Error generating listing'
    } as GenerateListingResponse, { status: 500 });
  }
}

// Function to generate mock listing data
function generateMockListing(objectType: string) {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  const objectName = capitalize(objectType);
  
  // Generate random adjectives for the title
  const adjectives = ['Vintage', 'Modern', 'Classic', 'Elegant', 'Rustic', 'Sleek', 'Handcrafted', 'Premium', 'Luxury', 'Unique'];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  
  // Generate random condition
  const conditions = ['New', 'Like New', 'Excellent', 'Good', 'Fair', 'Lightly Used'];
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  
  // Generate random price based on object type
  let basePrice = 50;
  if (['furniture', 'electronics', 'artwork'].includes(objectType)) {
    basePrice = 200;
  } else if (['clothing', 'kitchenware', 'tool'].includes(objectType)) {
    basePrice = 75;
  } else if (['jewelry', 'sports equipment'].includes(objectType)) {
    basePrice = 120;
  }
  
  // Add some randomness to the price
  const price = Math.round(basePrice * (0.8 + Math.random() * 0.4));
  
  // Generate keywords
  const allKeywords = [
    objectType, randomAdjective.toLowerCase(), randomCondition.toLowerCase(),
    'quality', 'bargain', 'home', 'gift', 'unique', 'stylish', 'practical',
    'essential', 'rare', 'collectible', 'handmade', 'discount'
  ];
  
  // Shuffle and take 5-7 keywords
  const shuffled = [...allKeywords].sort(() => 0.5 - Math.random());
  const keywordCount = 5 + Math.floor(Math.random() * 3);
  const keywords = shuffled.slice(0, keywordCount);
  
  return {
    name: `${randomAdjective} ${objectName} - Perfect for Any Home`,
    description: `This ${randomAdjective.toLowerCase()} ${objectType} is a must-have addition to your collection. Featuring exceptional craftsmanship and attention to detail, it showcases the perfect blend of style and functionality. The ${objectType} is in ${randomCondition.toLowerCase()} condition, with minimal signs of wear and tear, ensuring you receive a quality item that will last for years to come. Whether you're looking to upgrade your current setup or searching for the perfect gift, this ${objectType} is an excellent choice. Its versatile design complements any decor style, making it a seamless addition to your space. Don't miss the opportunity to own this remarkable piece at an unbeatable price.`,
    condition: randomCondition,
    price: price,
    keywords: keywords
  };
}
