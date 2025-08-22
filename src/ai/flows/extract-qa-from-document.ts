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
import {googleAI} from '@genkit-ai/googleai';

const ExtractQaFromDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document (PDF, Word, or TXT) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  focus: z.string().optional().describe("Keywords or topics to focus on."),
});
export type ExtractQaFromDocumentInput = z.infer<typeof ExtractQaFromDocumentInputSchema>;

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

const BASE_PROMPT = `
# 角色与任务
你是一位拥有医学背景的“医学教育”专家，擅长从医学教材、研究文献或临床指南中提取核心知识，并制作出用于高效记忆和理解的Anki卡片。你的唯一任务是根据用户提供的医学文档内容，生成一系列高质量、高精度的Anki记忆卡片。

# 核心原则
- **绝对精确与基于证据**：所有卡片内容必须严格基于提供的医学文献，不得有任何编造、推测或与原文相悖的信息。术语、数值、流程必须100%准确。
- **强调关联与机制**：优先选择文档中描述**机制、通路、病理生理、药理作用、鉴别诊断、临床意义**的内容进行提问，而非孤立的事实。
- **促进临床思维**：问题应模拟临床推理，促进对知识的深度理解和应用，而不仅仅是死记硬背。
- **图像整合**：如果文档中包含图片（如图表、X光片、病理切片等），并且图片对于理解某个知识点至关重要，请创建与该图片相关的卡片。将图片内容作为问题的一部分。

# 章节识别
- **识别结构**：在处理文档时，首先要识别文档的章节结构。寻找如 "第一章"、"Chapter 2"、"3.1 心脏的结构" 等明确的章节标题。
- **关联卡片**：生成的每一张卡片，都应该关联到它所属的章节。在输出的JSON对象中，使用 'chapter' 字段来存储该章节的完整标题。
- **无章节处理**：如果文档没有明确的章节结构，或者某部分内容不属于任何章节，则 'chapter' 字段可以省略或留空。

# 卡片内容要求（Cloze occlusion 和 Q&A 两种格式）
请生成两种类型的卡片：

## 1. 填空题 (Cloze Deletion) - 适用于精确记忆
- **内容**：选择包含**关键医学名词、数值、标准、分级名称**的句子。
- **省略**：每次**仅隐藏一个**最关键的信息点（如：一个病原体名称、一个药物靶点、一个实验室诊断标准值）。确保隐藏后，句子上下文能提供足够的推理线索。
- **格式**：使用 \`{{c1::隐藏内容}}\` 格式明确标出。
- **医学示例**：
  - 原文：”胃溃疡最常见的病因是幽门螺杆菌感染和非甾体抗炎药的使用。“
  - 输出：\`胃溃疡最常见的病因是{{c1::幽门螺杆菌感染}}和非甾体抗炎药的使用。\`
  - 原文：”诊断糖尿病的空腹血糖标准为 ≥ 7.0 mmol/L。“
  - 输出：\`诊断糖尿病的空腹血糖标准为 ≥ {{c1::7.0}} mmol/L。\`

## 2. 问答卡 (Q&A Card) - 适用于理解与推理
- **问题 (Front)**：
  - **类型**：提问方式应侧重于医学思维，包括：
    - **机制解释**：“简述左心衰竭导致肺水肿的病理生理机制。”
    - **鉴别诊断**：“急性阑尾炎与憩室炎的主要鉴别要点是什么？”
    - **临床表现**：“库欣综合征的典型临床表现有哪些？”
    - **治疗原则**：“社区获得性肺炎的一线经验性抗生素选择有哪些？”
    - **药物作用**：“二甲双胍的主要药理作用机制是什么？”
    - **图片问题**："根据这张X光片，最可能的诊断是什么？" 或 "图中箭头所指的细胞结构是什么？"
  - **要求**：问题必须临床相关、具体、无歧义。
- **答案 (Back)**：
  - **要求**：答案应精准、简洁、结构化。优先使用列表、流程图或分级陈述（如“首要...其次...”）来组织复杂信息，但需基于原文。

## 3. 图片处理
- 如果一张卡片是关于文档中的某张图片的，你应该在输出的JSON对象中包含 'media' 字段。
- **'media' 字段的值必须是与图片问题相关的图片本身，以Data URI (Base64) 的格式提供。模型有能力从文档中提取图片并转换为Data URI。**

# 输出格式与结构
你必须**严格**按照以下JSON数组格式输出，每张卡片作为一个对象，且不能有任何其他前言后语。

\`\`\`json
[
  {
    "type": "cloze",
    "chapter": "第一章：心脏生理学",
    "content": "完整的医学陈述句，其中{{c1::关键信息}}被隐藏。",
    "tags": ["标签1", "标签2", ...],
    "media": "data:image/png;base64,..."
  },
  {
    "type": "qa",
    "chapter": "第二章：影像学诊断",
    "front": "关于图片的清晰问题",
    "back": "准确、简洁、结构化的答案",
    "tags": ["标签1", "标签2", ...],
    "media": "data:image/jpeg;base64,..."
  },
  {
    "type": "qa",
    "front": "纯文本问题",
    "back": "纯文本答案",
    "tags": ["标签1", "标签2", ...]
  }
]
\`\`\`
`;

export async function extractQaFromDocument(
  input: ExtractQaFromDocumentInput
): Promise<ExtractQaFromDocumentOutput> {
  
  let finalPrompt = BASE_PROMPT;
  if (input.focus) {
    finalPrompt += `\n# 用户指定的重点\n用户希望你重点关注以下内容，并适当增加相关内容的题目比例与细致程度：${input.focus}`;
  }
  finalPrompt += `\nHere is the document:`;

  const { output } = await ai.generate({
    model: googleAI('gemini-1.5-pro-latest'),
    prompt: [
        {text: finalPrompt},
        {media: {url: input.documentDataUri}}
    ],
    output: {
        schema: ExtractQaFromDocumentOutputSchema
    }
  });
  return output || [];
}
