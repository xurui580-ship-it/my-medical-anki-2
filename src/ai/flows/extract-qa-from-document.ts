'use server';

/**
 * @fileOverview Client-side function to trigger the AI-powered Q&A extraction flow.
 * This file is imported by React components and uses `runFlow` to securely
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
  try {
    console.log("Running Genkit flow with input:", { focus: input.focus, uriLength: input.documentDataUri.length });
    
    // Use runFlow to securely call the defined flow from the client.
    // The first argument `extractQaFlow` is a reference to the flow defined in `src/ai/flows.ts`.
    const output = await runFlow(extractQaFlow, input);
    
    if (!output) {
      console.error("Genkit flow returned no output.");
      throw new Error("AI模型未能生成任何卡片。");
    }
    
    console.log(`Successfully extracted ${output.length} cards.`);
    return output;

  } catch (error) {
    console.error('Failed to process document with Genkit flow:', error);
    // Re-throw the error so the frontend can catch it and display a message.
    throw new Error("AI在处理文档时发生错误，请检查文档内容或稍后再试。");
  }
}
