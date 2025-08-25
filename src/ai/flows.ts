/**
 * @fileOverview Defines the Genkit flow for extracting Q&A from a document.
 * This file contains the AI prompt and the flow definition, and is only
 * intended to be loaded by the Genkit runtime.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { defineFlow } from 'genkit/flow';

// Define the input schema for the function
export const ExtractQaFromDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document (PDF, Word, or TXT) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  focus: z.string().optional().describe('Keywords or topics to focus on.'),
});
export type ExtractQaFromDocumentInput = z.infer<typeof ExtractQaFromDocumentInputSchema>;


// Define the expected output structure from the AI model
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
export type ExtractQaFromDocumentOutput = z.infer<typeof ExtractQaFromDocumentOutputSchema>;

const qaExtractionPrompt = ai.definePrompt({
    name: 'qaExtractionPrompt',
    inputSchema: ExtractQaFromDocumentInputSchema,
    outputSchema: ExtractQaFromDocumentOutputSchema,
    prompt: `
# 角色与任务
你是一位拥有医学背景的“医学教育”专家，擅长从医学教材、研究文献或临床指南中提取核心知识，并制作出用于高效记忆和理解的Anki卡片。你的唯一任务是根据用户提供的医学文档内容，生成一系列高质量、高精度的Anki记忆卡片。

# 核心原则
- **绝对精确与基于证据**：所有卡片内容必须严格基于提供的医学文献，不得有任何编造、推测或与原文相悖的信息。术语、数值、流程必须100%准确。
- **强调关联与机制**：优先选择文档中描述**机制、通路、病理生理、药理作用、鉴别诊断、临床意义**的内容进行提问，而非孤立的事实。
- **促进临床思维**：问题应模拟临床推理，促进对知识的深度理解和应用，而不仅仅是死记硬背。

# 章节识别
- **识别结构**：在处理文档时，首先要识别文档的章节结构。寻找如 "第一章"、"Chapter 2"、"3.1 心脏的结构" 等明确的章节标题。
- **关联卡片**：生成的每一张卡片，都应该关联到它所属的章节。在输出的JSON对象中，使用 'chapter' 字段来存储该章节的完整标题。
- **无章节处理**：如果文档没有明确的章节结构，或者某部分内容不属于任何章节，则 'chapter' 字段可以省略或留空。

# 卡片内容要求（Cloze 和 Q&A 两种格式）
请生成两种类型的卡片：

## 1. 填空题 (Cloze Deletion) - 适用于精确记忆
- **内容**：选择包含**关键医学名词、数值、标准、分级名称**的句子。
- **省略**：每次**仅隐藏一个**最关键的信息点。
- **格式**：使用 \`{{c1::隐藏内容}}\` 格式明确标出。

## 2. 问答卡 (Q&A Card) - 适用于理解与推理
- **问题 (Front)**：应侧重于医学思维，如机制、鉴别诊断、临床表现、治疗原则、药物作用等。
- **答案 (Back)**：应精准、简洁、结构化。

# 用户指定的重点
{{#if focus}}
请在生成卡片时，特别关注以下由用户指定的重点：{{focus}}
{{/if}}

# 文档内容
这是用户提供的文档，请基于此内容生成卡片：
{{media url=documentDataUri}}
`,
});

export const extractQaFlow = defineFlow(
  {
    name: 'extractQaFlow',
    inputSchema: ExtractQaFromDocumentInputSchema,
    outputSchema: ExtractQaFromDocumentOutputSchema,
  },
  async (input) => {
    try {
        console.log("Running Genkit flow with input:", { focus: input.focus, uriLength: input.documentDataUri.length });
        const { output } = await qaExtractionPrompt(input);

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
);
