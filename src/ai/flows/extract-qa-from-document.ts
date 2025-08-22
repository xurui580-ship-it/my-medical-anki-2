// src/ai/flows/extract-qa-from-document.ts
'use server';

/**
 * @fileOverview Extracts questions and answers from a document using an LLM to create a flashcard deck.
 *
 * - extractQaFromDocument - A function that extracts Q&A pairs from a document.
 * - ExtractQaFromDocumentInput - The input type for the extractQaFromDocument function.
 * - ExtractQaFromDocumentOutput - The return type for the extractQaFromDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractQaFromDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document (PDF, Word, or TXT) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractQaFromDocumentInput = z.infer<typeof ExtractQaFromDocumentInputSchema>;

const ExtractQaFromDocumentOutputSchema = z.array(
  z.object({
    q: z.string().describe('The question.'),
    a: z.string().describe('The answer.'),
  })
);
export type ExtractQaFromDocumentOutput = z.infer<typeof ExtractQaFromDocumentOutputSchema>;

export async function extractQaFromDocument(
  input: ExtractQaFromDocumentInput
): Promise<ExtractQaFromDocumentOutput> {
  return extractQaFromDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractQaFromDocumentPrompt',
  input: {schema: ExtractQaFromDocumentInputSchema},
  output: {schema: ExtractQaFromDocumentOutputSchema},
  prompt: `You are a helpful AI assistant designed to extract questions and answers from documents.

  You will receive a document as input, and your task is to identify potential question and answer pairs within the document's content.
  The output must be a JSON array of objects, where each object has a "q" field for the question and an "a" field for the answer.

  Here is the document:
  {{documentDataUri}}`,
});

const extractQaFromDocumentFlow = ai.defineFlow(
  {
    name: 'extractQaFromDocumentFlow',
    inputSchema: ExtractQaFromDocumentInputSchema,
    outputSchema: ExtractQaFromDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
