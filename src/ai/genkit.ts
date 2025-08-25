/**
 * @fileOverview Genkit initialization.
 * This file initializes the Genkit AI instance.
 */
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Prevent re-initialization in Next.js dev server hot-reloading
const g = globalThis as any;

if (!g.ai) {
  g.ai = genkit({
    plugins: [googleAI({ apiVersion: 'v1beta' })],
  });
}

export const ai = g.ai;
