'use server';
/**
 * @fileOverview Defines the client-callable server action that can be used to
 * call the backend Genkit flow.
 */
import { runFlow } from '@genkit-ai/next/server';
import type {
  ExtractQaFromDocumentInput,
  ExtractQaFromDocumentOutput,
} from './types';

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
