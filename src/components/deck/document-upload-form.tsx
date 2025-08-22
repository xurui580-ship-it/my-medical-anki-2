"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { extractQaFromDocument, ExtractQaFromDocumentOutput } from "@/ai/flows/extract-qa-from-document";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UploadCloud, CheckCircle, AlertTriangle, Wand2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type FormState = "idle" | "uploading" | "processing" | "reviewing" | "error";

export function DocumentUploadForm() {
  const { register, handleSubmit } = useForm<{ document: FileList }>();
  const [formState, setFormState] = useState<FormState>("idle");
  const [extractedQAs, setExtractedQAs] = useState<ExtractQaFromDocumentOutput>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async (data: { document: FileList }) => {
    const file = data.document[0];
    if (!file) return;

    setFormState("uploading");
    setErrorMessage("");

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const documentDataUri = e.target?.result as string;
        setFormState("processing");
        const result = await extractQaFromDocument({ documentDataUri });
        if (result && result.length > 0) {
          setExtractedQAs(result);
          setFormState("reviewing");
        } else {
          setErrorMessage("无法从文档中提取任何问答对。请尝试其他文档。");
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
    console.log("Saving deck:", extractedQAs);
    toast({
      title: "卡组已保存",
      description: "从文档导入的卡组已成功创建。",
    });
    router.push("/decks");
  };

  const stateContent = {
    idle: (
      <>
        <UploadCloud className="w-12 h-12 mx-auto text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">拖放文件到这里，或点击选择文件</p>
        <Input id="document-upload" type="file" className="sr-only" {...register("document")} accept=".pdf,.doc,.docx,.txt" onChange={handleSubmit(onSubmit)} />
      </>
    ),
    uploading: <><Loader2 className="w-12 h-12 mx-auto animate-spin" /><p className="mt-2">正在上传...</p></>,
    processing: <><Wand2 className="w-12 h-12 mx-auto animate-pulse text-primary" /><p className="mt-2">AI 正在努力提取中...</p></>,
    error: <><AlertTriangle className="w-12 h-12 mx-auto text-destructive" /><p className="mt-2 text-destructive">{errorMessage}</p><Button onClick={() => setFormState('idle')} className="mt-4">重试</Button></>,
  };

  if (formState !== "reviewing") {
    return (
      <Card className="glass-card">
        <CardContent className="p-6">
          <label htmlFor="document-upload" className="cursor-pointer">
            <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
              {stateContent[formState]}
            </div>
          </label>
        </CardContent>
      </Card>
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
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">AI 从您的文档中提取了 {extractedQAs.length} 个问答对。请检查并确认后保存。</p>
                 <Accordion type="single" collapsible className="w-full">
                    {extractedQAs.map((qa, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>Q{index + 1}: {qa.q}</AccordionTrigger>
                            <AccordionContent className="text-base">
                                <strong>答案:</strong> {qa.a}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
        <div className="flex justify-end gap-4">
             <Button variant="outline" onClick={() => setFormState('idle')}>重新上传</Button>
            <Button variant="warm" onClick={handleSaveDeck}>
                <Save className="mr-2 h-4 w-4" />
                确认并保存卡组
            </Button>
        </div>
    </div>
  );
}
