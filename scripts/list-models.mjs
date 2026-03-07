import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('Error: GOOGLE_API_KEY or GEMINI_API_KEY is not set');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function listModels() {
  try {
    const response = await ai.models.list();
    console.log('Available models:');
    for await (const model of response) {
        if (model.name.includes('image') || model.name.includes('banana')) {
             console.log(`- ${model.name} (${model.displayName})`);
             if (model.supportedGenerationMethods) console.log(`  Methods: ${model.supportedGenerationMethods.join(', ')}`);
             if (model.supportedActions) console.log(`  Actions: ${model.supportedActions.join(', ')}`);
        }
    }
  } catch (error) {
    console.error('Error listing models:', error);
  }
}

listModels();