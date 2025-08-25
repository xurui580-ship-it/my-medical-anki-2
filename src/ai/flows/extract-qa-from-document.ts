'use server';
/**
 * @fileOverview Defines the client-callable server action for extracting Q&A from a document.
 * This file separates the client-facing action from the Genkit flow definition.
 */
import { runFlow } from '@genkit-ai/next/server';
import type {
  ExtractQaFromDocumentInput,
  ExtractQaFromDocumentOutput,
} from '@/ai/flows';

// Re-export types for client-side components
export type {
  ExtractQaFromDocumentInput,
  ExtractQaFromDocumentOutput,
};

/**
 * A server action that can be called from client components to run the
 * Q&A extraction flow. It uses runFlow to securely call the flow by name.
 * @param input The document data and focus.
 * @returns An array of extracted question and answer cards.
 */
export async function extractQaFromDocument(
  input: ExtractQaFromDocumentInput
): Promise<ExtractQaFromDocumentOutput> {
  return await runFlow('extractQaFlow', input);
}
