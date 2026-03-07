import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import sharp from 'sharp';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RECIPES_DIR = path.join(__dirname, '../content/recipes');
const IMAGES_DIR = path.join(__dirname, '../public/images/recipes');

// Initialize Google GenAI client
const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

// Initialize OpenAI client (fallback)
const openaiApiKey = process.env.OPENAI_API_KEY;
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

if (!apiKey && !openaiApiKey) {
  console.error('Error: Neither GOOGLE_API_KEY nor OPENAI_API_KEY is set in .env.local');
  process.exit(1);
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

async function generateImageWithOpenAI(title, description) {
    if (!openai) {
        console.log('OpenAI API key not found. Skipping fallback.');
        return null;
    }
    console.log(`Generating image for: ${title} using OpenAI DALL-E 3 (Fallback)`);
    const prompt = `Generate a realistic, high-quality food photography image for a cooking website. Style: Minimalistic, elegant, studio lighting, dark background. Subject: ${title}. Description: ${description}. No text, no people, just the food.`;
    
    try {
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            quality: "standard",
            response_format: "b64_json",
        });
        return response.data[0].b64_json;
    } catch (error) {
        console.error(`Error generating image with OpenAI for ${title}:`, error);
        return null;
    }
}

async function generateImage(title, description) {
  const prompt = `Generate a realistic, high-quality food photography image for a cooking website. Style: Minimalistic, elegant, studio lighting, dark background. Subject: ${title}. Description: ${description}. No text, no people, just the food.`;

  // Check for FORCE_OPENAI flag
  if (process.env.FORCE_OPENAI === 'true') {
      return await generateImageWithOpenAI(title, description);
  }

  if (ai) {
      console.log(`Generating image for: ${title} using Google Nano Banana 2 (Gemini 3.1 Flash Image)`);
      try {
        // Try Gemini 3.1 Flash Image Preview (Nano Banana 2)
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-image-preview',
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          config: {
             // No responseMimeType for image generation models via generateContent
          }
        });

        const candidate = response.candidates?.[0];
        if (candidate?.content?.parts) {
            for (const part of candidate.content.parts) {
                if (part.inlineData) {
                    return part.inlineData.data;
                }
            }
        }
        
        if (candidate?.content?.parts?.[0]?.text) {
            console.error(`Model returned text instead of image.`);
        } else {
            console.error(`No image data in Google response for ${title}`);
        }

      } catch (error) {
        console.error(`Error generating image with Google for ${title}:`, error.message);
        
        // Fallback to Gemini 2.5 Flash Image (Nano Banana)
        console.log('Retrying with Gemini 2.5 Flash Image (Nano Banana)...');
        try {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait a bit
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: [
                    {
                      role: 'user',
                      parts: [{ text: prompt }]
                    }
                ],
                config: {}
            });
            
            const candidate = response.candidates?.[0];
            if (candidate?.content?.parts) {
                for (const part of candidate.content.parts) {
                    if (part.inlineData) {
                        return part.inlineData.data;
                    }
                }
            }
        } catch (retryError) {
             console.error('Retry with Nano Banana failed:', retryError.message);
        }

        // If quota exceeded or other error, fallback to OpenAI
        if (error.message.includes('429') || error.message.includes('403') || error.message.includes('quota') || error.message.includes('not found')) {
            console.log('Google API quota exceeded, error, or model not found. Switching to OpenAI fallback...');
            return await generateImageWithOpenAI(title, description);
        }
      }
  } else {
      return await generateImageWithOpenAI(title, description);
  }
  
  // If Google failed but not due to quota (or we didn't return yet), try OpenAI
  return await generateImageWithOpenAI(title, description);
}

async function optimizeImage(buffer, outputPath) {
    try {
        await sharp(buffer)
            .resize(1200, 800, { // 3:2 Aspect Ratio
                fit: 'cover',
                position: 'center'
            })
            .webp({ quality: 80 }) // Convert to WebP with 80% quality
            .toFile(outputPath);
        console.log(`Optimized image saved to ${outputPath}`);
        return true;
    } catch (error) {
        console.error(`Error optimizing image:`, error);
        return false;
    }
}

async function processRecipes() {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (!apiKey && !openaiApiKey) {
    console.error('Error: Neither GOOGLE_API_KEY nor OPENAI_API_KEY is set in .env.local');
    process.exit(1);
  }

  const files = fs.readdirSync(RECIPES_DIR).filter(file => file.endsWith('.md'));

  for (const file of files) {
    const filePath = path.join(RECIPES_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    // Skip if image already exists
    if (data.image) {
      console.log(`Skipping ${file} - image already exists`);
      continue;
    }

    // Check if it's an English translation file
    const isEnglish = file.endsWith('.en.md');
    const baseName = isEnglish ? file.replace('.en.md', '') : file.replace('.md', '');
    
    // If it's an English file, check if the base file has an image we can reuse
    if (isEnglish) {
        const baseFilePath = path.join(RECIPES_DIR, `${baseName}.md`);
        if (fs.existsSync(baseFilePath)) {
            const baseContent = fs.readFileSync(baseFilePath, 'utf8');
            const baseData = matter(baseContent).data;
            if (baseData.image) {
                console.log(`Using existing image from ${baseName}.md for ${file}`);
                data.image = baseData.image;
                const newContent = matter.stringify(content, data);
                fs.writeFileSync(filePath, newContent);
                continue;
            }
        }
    }

    const imageSlug = baseName;
    const imageFileName = `${imageSlug}.webp`; // Changed extension to webp
    const imagePath = path.join(IMAGES_DIR, imageFileName);
    const publicPath = `/images/recipes/${imageFileName}`;

    // Check if image file exists even if not in frontmatter
    if (fs.existsSync(imagePath)) {
        console.log(`Image file exists for ${file}, updating frontmatter...`);
        data.image = publicPath;
        const newContent = matter.stringify(content, data);
        fs.writeFileSync(filePath, newContent);
        continue;
    }

    // Generate new image
    const b64Json = await generateImage(data.title, data.description || data.title);
    
    if (b64Json) {
      const buffer = Buffer.from(b64Json, 'base64');
      
      // Optimize and save
      const success = await optimizeImage(buffer, imagePath);
      
      if (success) {
        data.image = publicPath;
        const newContent = matter.stringify(content, data);
        fs.writeFileSync(filePath, newContent);
        console.log(`Updated ${file} with new image path`);
      }
    }
  }
}

processRecipes();
