'use server';
/**
 * @fileOverview Client-callable server action to trigger the document QA extraction flow.
 * This file provides the exported function that the Next.js frontend can
 * call. It uses `runFlow` from the Genkit Next.js plugin to securely
 * call the backend Genkit flow.
 */
import { runFlow } from '@genkit-ai/next/server';
import type {
  ExtractQaFromDocumentInput,
  ExtractQaFromDocumentOutput,
} from '@/ai/flows';
import { extractQaFlow } from '@/ai/flows';

/**
 * The main client-callable function that triggers the Genkit flow.
 * @param input The document data URI and optional focus.
 * @returns A promise that resolves to the array of extracted Q&A cards.
 */
export async function extractQaFromDocument(
  input: ExtractQaFromDocumentInput
): Promise<ExtractQaFromDocumentOutput> {
  // The Genkit Next.js plugin will handle routing this call correctly.
  return await runFlow(extractQaFlow, input);
}
