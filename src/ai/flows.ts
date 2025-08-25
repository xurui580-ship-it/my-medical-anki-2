/**
 * @fileOverview Type definitions for AI flows.
 * This file exports the TypeScript types derived from Zod schemas
 * defined in `genkit.ts`. These types are shared between the server
 * and client components.
 */
import type { z } from 'zod';
import type { 
    ExtractQaFromDocumentInputSchema, 
    ExtractQaFromDocumentOutputSchema 
} from '@/ai/genkit';

export type ExtractQaFromDocumentInput = z.infer<typeof ExtractQaFromDocumentInputSchema>;
export type ExtractQaFromDocumentOutput = z.infer<typeof ExtractQaFromDocumentOutputSchema>;
