
'use server';

/**
 * @fileOverview Extracts questions and answers from a document by calling a custom LLM API endpoint.
 *
 * - extractQaFromDocument - A function that calls an external API to extract Q&A pairs.
 * - ExtractQaFromDocumentInput - The input type for the extractQaFromDocument function.
 * - ExtractQaFromDocumentOutput - The return type for the extractQaFromDocument function.
 */

import { z } from 'zod';

// Define the input schema for the function
const ExtractQaFromDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document (PDF, Word, or TXT) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  focus: z.string().optional().describe('Keywords or topics to focus on.'),
});
export type ExtractQaFromDocumentInput = z.infer<typeof ExtractQaFromDocumentInputSchema>;


// Define the expected output structure from the API
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

const ExtractQaFromDocumentOutputSchema = z.array(z.union([ClozeCardSchema, QaCardSchema]));
export type ExtractQaFromDocumentOutput = z.infer<typeof ExtractQaFromDocumentOutputSchema>;


// The main function that calls the external API
export async function extractQaFromDocument(
  input: ExtractQaFromDocumentInput
): Promise<ExtractQaFromDocumentOutput> {

  const API_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
  const API_KEY = process.env.CUSTOM_LLM_API_KEY;

  if (!API_KEY) {
    throw new Error('CUSTOM_LLM_API_KEY is not set in the environment variables.');
  }

  // System prompt that defines the role and task for the AI
  const SYSTEM_PROMPT = `
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

# 输出格式
你必须**严格**按照以下JSON数组格式输出，**只输出纯粹的JSON数组，不包含任何解释、前言或markdown代码块标记**。

\`\`\`json
[
  {
    "type": "cloze",
    "chapter": "第一章：心脏生理学",
    "content": "完整的医学陈述句，其中{{c1::关键信息}}被隐藏。",
    "tags": ["标签1", "标签2"]
  },
  {
    "type": "qa",
    "chapter": "第二章：影像学诊断",
    "front": "关于图片的清晰问题",
    "back": "准确、简洁、结构化的答案",
    "tags": ["标签1", "标签2"]
  }
]
\`\`\`
`;

  // Prepare the content for the user message
  let user_prompt = `这是我上传的文档内容（以Data URI格式），请根据它生成卡片。文档数据如下：\n${input.documentDataUri}`;
  if(input.focus) {
    user_prompt += `\n\n请特别关注以下重点：${input.focus}`;
  }


  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'X-Title': 'MediFlash', // Optional: For OpenRouter ranking
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat", // DeepSeek V3 Chat Model
        messages: [
            { "role": "system", "content": SYSTEM_PROMPT },
            { "role": "user", "content": user_prompt }
        ],
        // The API returns a JSON object that contains a string. We need to parse that string.
        // So we can't use response_format here directly.
        // response_format: { "type": "json_object" }
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('API Error Response:', errorBody);
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    // Extract the string content from the response
    const messageContent = result.choices[0]?.message?.content;
    if (!messageContent) {
        throw new Error("API response did not contain valid content.");
    }

    // Parse the string content as JSON. It might contain ```json ... ``` markers.
    const jsonRegex = /```json\n([\s\S]*?)\n```/;
    const match = messageContent.match(jsonRegex);
    const jsonString = match ? match[1] : messageContent;

    const parsedJson = JSON.parse(jsonString);

    // Validate the parsed JSON against our schema
    const validatedResult = ExtractQaFromDocumentOutputSchema.safeParse(parsedJson);

    if (!validatedResult.success) {
        console.error("API response validation error:", validatedResult.error.flatten());
        throw new Error("Received invalid data structure from the API.");
    }

    return validatedResult.data;

  } catch (error) {
    console.error('Failed to call custom LLM API:', error);
    // Re-throw the error so the frontend can catch it
    throw error;
  }
}
