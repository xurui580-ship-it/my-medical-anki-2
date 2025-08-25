import { config } from 'dotenv';
config();

// Import all flows so that they are registered with Genkit.
import '@/ai/genkit';
import '@/ai/flows/extract-qa-from-document';
