'use server';
/**
 * @fileOverview Defines the server action that can be called from client components to
 * call the backend Genkit flow.
 */
import { runFlow } from '@genkit-ai/next/server';
import type {
  ExtractQaFromDocumentInput,
  ExtractQaFromDocumentOutput,
} from '@/ai/flows';

export type {
  ExtractQaFromDocumentInput,
  ExtractQaFromDocumentOutput,
};


/**
 * A server action that can be called from client components to run the
 * Q&A extraction flow.
 * @param input The document data and focus.
 * @returns An array of extracted question and answer cards.
 */
export async function extractQaFromDocument(
  input: ExtractQaFromDocumentInput
): Promise<ExtractQaFromDocumentOutput> {
   return await runFlow('extractQaFlow', input);
}
