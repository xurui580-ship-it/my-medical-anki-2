'use server';
/**
 * @fileOverview Defines the client-callable server action for extracting Q&A from a document.
 * This file separates the client-facing action from the Genkit flow definition.
 */
import { extractQaFlow } from '@/ai/flows';
import type {
  ExtractQaFromDocumentInput,
  ExtractQaFromDocumentOutput,
} from '@/ai/flows';

// Re-export types for client-side components
export type {
  ExtractQaFromDocumentInput,
  ExtractQaFromDocumentOutput,
};
export { ExtractQaFromDocumentInputSchema } from '@/ai/flows';


/**
 * A server action that can be called from client components to run the
 * Q&A extraction flow.
 * @param input The document data and focus.
 * @returns An array of extracted question and answer cards.
 */
export async function extractQaFromDocument(
  input: ExtractQaFromDocumentInput
): Promise<ExtractQaFromDocumentOutput> {
  return await extractQaFlow(input);
}
