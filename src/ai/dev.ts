import { config } from 'dotenv';
config();

// Import all flows so that they are registered with Genkit.
import '@/ai/flows.ts';
