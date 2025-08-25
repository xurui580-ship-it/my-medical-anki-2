
'use server';
/**
 * @fileOverview Server actions for Next.js components.
 * This file contains the functions that can be directly called from React components
 * to trigger backend Genkit flows.
 */
import { runFlow } from '@genkit-ai/next/server';
import type {
  ExtractQaFromDocumentInput,
  ExtractQaFromDocumentOutput,
} from './flows';
import { extractQaFlow } from './flows';


/**
 * A server action that can be called from client components to run the
 * Q&A extraction flow.
 * @param input The document data and focus.
 * @returns An array of extracted question and answer cards.
 */
export async function extractQaFromDocument(
  input: ExtractQaFromDocumentInput
): Promise<ExtractQaFromDocumentOutput> {
   return await runFlow(extractQaFlow, input);
}
