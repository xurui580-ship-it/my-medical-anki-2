
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { extractQaFromDocument, ExtractQaFromDocumentOutput } from "@/ai/flows/extract-qa-from-document";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, UploadCloud, CheckCircle, AlertTriangle, Wand2, Save, Badge } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type FormValues = {
    document: FileList;
    focus: string;
}

type FormState = "idle" | "uploading" | "processing" | "reviewing" | "error";

export function DocumentUploadForm() {
  const { register, handleSubmit, watch } = useForm<FormValues>();
  const [formState, setFormState] = useState<FormState>("idle");
  const [extractedCards, setExtractedCards] = useState<ExtractQaFromDocumentOutput>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const documentFile = watch("document");


  const onSubmit = async (data: FormValues) => {
    const file = data.document[0];
    if (!file) return;

    setFormState("uploading");
    setErrorMessage("");

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const documentDataUri = e.target?.result as string;
        setFormState("processing");
        const result = await extractQaFromDocument({ documentDataUri, focus: data.focus });
        if (result && result.length > 0) {
          setExtractedCards(result);
          setFormState("reviewing");
        } else {
          setErrorMessage("无法从文档中提取任何卡片。请尝试其他文档。");
          setFormState("error");
        }
      };
      reader.onerror = () => {
        setErrorMessage("读取文件时发生错误。");
        setFormState("error");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      setErrorMessage("处理文档时发生未知错误。");
      setFormState("error");
    }
  };

  const handleSaveDeck = () => {
    // In a real app, save the extractedQAs to the user's decks
    console.log("Saving deck:", extractedCards);
    toast({
      title: "卡组已保存",
      description: "从文档导入的卡组已成功创建。",
    });
    router.push("/decks");
  };

  const idleContent = (
    <div className="text-center">
        <UploadCloud className="w-12 h-12 mx-auto text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">拖放文件到这里，或点击选择文件</p>
        <Input id="document-upload" type="file" className="sr-only" {...register("document")} accept=".pdf,.doc,.docx,.txt" />
    </div>
  );

  const stateContent = {
    uploading: <><Loader2 className="w-12 h-12 mx-auto animate-spin" /><p className="mt-2">正在上传...</p></>,
    processing: <><Wand2 className="w-12 h-12 mx-auto animate-pulse text-primary" /><p className="mt-2">AI 正在努力提取中...</p></>,
    error: <><AlertTriangle className="w-12 h-12 mx-auto text-destructive" /><p className="mt-2 text-destructive">{errorMessage}</p><Button onClick={() => setFormState('idle')} className="mt-4">重试</Button></>,
  };

  if (formState !== "reviewing") {
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="glass-card">
                <CardContent className="p-6">
                <label htmlFor={formState === 'idle' ? 'document-upload' : undefined} className={formState === 'idle' ? 'cursor-pointer' : ''}>
                    <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
                    {formState !== 'idle' ? stateContent[formState] : 
                        (documentFile && documentFile.length > 0) ? 
                        <p className="text-sm text-primary">{documentFile[0].name}</p> 
                        : idleContent
                    }
                    </div>
                </label>
                 <div className="mt-6">
                    <Label htmlFor="focus-input" className="mb-2 block">重点提示 (选填)</Label>
                     <Input 
                        id="focus-input" 
                        placeholder="例如：重点关注治疗方案和药物剂量"
                        {...register("focus")}
                        disabled={formState !== 'idle'}
                    />
                     <p className="text-xs text-muted-foreground mt-2">
                        给AI一些提示，告诉它哪些是重点，以便更精确地生成卡片。
                    </p>
                 </div>
                 <Button type="submit" className="w-full mt-6" disabled={formState !== 'idle' || !documentFile || documentFile.length === 0} variant="warm">
                    {formState === 'idle' ? <><Wand2 className="mr-2"/>开始提取</> : '...'}
                 </Button>
                </CardContent>
            </Card>
      </form>
    );
  }

  return (
    <div>
        <Card className="glass-card mb-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="text-secondary" />
                    提取成功 - 请审核
                </CardTitle>
                 <CardDescription>AI 从您的文档中提取了 {extractedCards.length} 张卡片。请检查并确认后保存。</CardDescription>
            </CardHeader>
            <CardContent>
                 <Accordion type="single" collapsible className="w-full">
                    {extractedCards.map((card, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>
                               <div className="flex items-center gap-2">
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${card.type === 'cloze' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                    {card.type === 'cloze' ? '填空' : '问答'}
                                </span>
                                <span>{card.type === 'cloze' ? card.content.substring(0, 80) + '...' : `Q${index+1}: ${card.front}`}</span>
                               </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-base space-y-4">
                                {card.type === 'cloze' ? (
                                    <div dangerouslySetInnerHTML={{ __html: card.content.replace(/{{c1::(.*?)}}/g, '<strong class="text-primary">[$1]</strong>') }} />
                                ) : (
                                    <div>
                                        <p><strong>答案:</strong> {card.back}</p>
                                    </div>
                                )}
                                <div className="flex gap-2 flex-wrap">
                                    {card.tags.map(tag => (
                                        <span key={tag} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">{tag}</span>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
        <div className="flex justify-end gap-4">
             <Button variant="outline" onClick={() => {
                setFormState('idle');
                setExtractedCards([]);
             }}>重新上传</Button>
            <Button variant="warm" onClick={handleSaveDeck}>
                <Save className="mr-2 h-4 w-4" />
                确认并保存卡组
            </Button>
        </div>
    </div>
  );
}
