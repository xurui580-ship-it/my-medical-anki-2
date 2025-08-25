'use server';
/**
 * @fileOverview Client-side function to trigger the AI-powered Q&A extraction flow.
 * This file defines the Genkit flow and also exports a function that can be
 * called from React components.
 */

import { runFlow } from 'genkit/next';
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
  try {
    console.log("Running Genkit flow with input:", { focus: input.focus, uriLength: input.documentDataUri.length });
    
    // With the @genkit-ai/next plugin, we can directly call the flow
    // from server components or other server-side code.
    const output = await extractQaFlow(input);
    
    if (!output) {
      console.error("Genkit flow returned no output.");
      throw new Error("AI模型未能生成任何卡片。");
    }
    
    console.log(`Successfully extracted ${output.length} cards.`);
    return output;

  } catch (error) {
    console.error('Failed to process document with Genkit:', error);
    // Re-throw the error so the frontend can catch it and display a message.
    throw new Error("AI在处理文档时发生错误，请检查文档内容或稍后再试。");
  }
}
