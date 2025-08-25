'use server';
import { z } from 'zod';

// --- Schema Definitions ---

export const ExtractQaFromDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document (PDF, Word, or TXT) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  focus: z.string().optional().describe('Keywords or topics to focus on.'),
});

const ClozeCardSchema = z.object({
    type: z.literal("cloze"),
    chapter: z.string().optional().describe("如果识别到，则为卡片内容所属的章节标题。"),
    content: z.string().describe("The full medical statement with the key information hidden using {{c1::...}}."),
    tags: z.array(z.string()).describe("Tags related to the card content (e.g., discipline, system, disease)."),
    media: z.string().optional().describe("An optional data URI for an image related to the card."),
});

const QaCardSchema = z.object({
    type: z.literal("qa"),
    chapter: z.string().optional().describe("如果识别到，则为卡片内容所属的章节标题。"),
    front: z.string().describe("A clear, specific clinical or mechanistic question."),
    back: z.string().describe("A precise, concise, and structured answer."),
    tags: z.array(z.string()).describe("Tags related to the card content."),
    media: z.string().optional().describe("An optional data URI for an image related to the card."),
});

export const ExtractQaFromDocumentOutputSchema = z.array(z.union([ClozeCardSchema, QaCardSchema]));

// --- Type Exports for Client Components ---

export type ExtractQaFromDocumentInput = z.infer<typeof ExtractQaFromDocumentInputSchema>;
export type ExtractQaFromDocumentOutput = z.infer<typeof ExtractQaFromDocumentOutputSchema>;
