import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

export const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

export const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY
});
