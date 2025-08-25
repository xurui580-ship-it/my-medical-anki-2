
"use client";

import { useState, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { extractQaFromDocument } from "@/ai/actions";
import type { ExtractQaFromDocumentOutput } from "@/ai/flows";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, UploadCloud, CheckCircle, AlertTriangle, Wand2, Save, Badge, Folder, FileText, FileUp, Replace } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useDecks } from "@/contexts/DeckContext";
import type { Card as CardType, Deck } from "@/lib/types";

type FormValues = {
    focus: string;
}

type FormState = "idle" | "uploading" | "processing" | "reviewing" | "error";

export function DocumentUploadForm() {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const [formState, setFormState] = useState<FormState>("idle");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [extractedCards, setExtractedCards] = useState<ExtractQaFromDocumentOutput>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const { addDeck } = useDecks();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const groupedCards = useMemo(() => {
    if (formState !== 'reviewing') return {};

    return extractedCards.reduce((acc, card) => {
        const groupName = card.chapter || "未分类";
        if (!acc[groupName]) {
            acc[groupName] = [];
        }
        acc[groupName].push(card);
        return acc;
    }, {} as Record<string, ExtractQaFromDocumentOutput>);
  }, [extractedCards, formState]);


  const onSubmit = async (data: FormValues) => {
    if (!documentFile) return;

    setFormState("uploading");
    setErrorMessage("");

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const documentDataUri = e.target?.result as string;
        setFormState("processing");
        try {
            const result = await extractQaFromDocument({ documentDataUri, focus: data.focus });
            if (result && result.length > 0) {
              setExtractedCards(result);
              setFormState("reviewing");
            } else {
              setErrorMessage("无法从文档中提取任何卡片。请尝试其他文档。");
              setFormState("error");
            }
        } catch(e) {
            console.error(e);
            const error = e as Error;
            setErrorMessage(error.message || "AI在处理时发生错误，可能是文档内容过于复杂或格式不受支持。");
            setFormState("error");
        }
      };
      reader.onerror = () => {
        setErrorMessage("读取文件时发生错误。");
        setFormState("error");
      };
      reader.readAsDataURL(documentFile);
    } catch (error) {
      console.error(error);
      setErrorMessage("处理文档时发生未知错误。");
      setFormState("error");
    }
  };

  const handleSaveDeck = () => {
    if (!documentFile || extractedCards.length === 0) {
        toast({
            title: "无法保存",
            description: "没有可保存的卡片。",
            variant: "destructive"
        });
        return;
    }

    const deckName = documentFile.name.replace(/\.[^/.]+$/, "");

    const newDeck: Deck = {
        id: `doc-${Date.now()}`,
        name: deckName,
        source: 'doc',
        createdAt: new Date().toISOString(),
        dailyNewLearned: 0,
        reviewModeToday: false,
        cards: extractedCards.map((card, index) => ({
            id: `doc-card-${Date.now()}-${index}`,
            q: card.type === 'qa' ? card.front : card.content,
            a: card.type === 'qa' ? card.back : card.content.replace(/{{c1::(.*?)}}/g, '$1'),
            chapter: card.chapter,
            media: card.media,
            isNew: true,
            ease: 2.5,
            intervalDays: 0,
            repetitions: 0,
            dueAt: new Date().toISOString(),
            history: [],
        })) as CardType[],
    };

    addDeck(newDeck);
    
    toast({
      title: "卡组已保存",
      description: `从文档 "${deckName}" 导入的卡组已成功创建。`,
    });
    router.push("/decks");
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        setDocumentFile(e.target.files[0]);
    }
  }
  
  const triggerFileSelect = () => {
      fileInputRef.current?.click();
  }

  const resetState = () => {
    setFormState('idle');
    setDocumentFile(null);
    setExtractedCards([]);
    setErrorMessage("");
    reset(); // Resets the 'focus' field
  }


  const idleContent = (
    <div className="text-center">
        <UploadCloud className="w-12 h-12 mx-auto text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">拖放文件到这里，或点击选择文件</p>
    </div>
  );

  const stateContent = {
    uploading: <><Loader2 className="w-12 h-12 mx-auto animate-spin" /><p className="mt-2">正在上传...</p></>,
    processing: <><Wand2 className="w-12 h-12 mx-auto animate-pulse text-primary" /><p className="mt-2">AI 正在努力提取中...</p></>,
    error: <><AlertTriangle className="w-12 h-12 mx-auto text-destructive" /><p className="mt-2 text-destructive">{errorMessage}</p><Button onClick={resetState} className="mt-4">重试</Button></>,
  };

  if (formState !== "reviewing") {
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="glass-card">
                <CardContent className="p-6">
                <div onClick={formState === 'idle' ? triggerFileSelect : undefined} className={formState === 'idle' ? 'cursor-pointer' : ''}>
                    <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
                    {formState !== 'idle' ? stateContent[formState] : 
                        documentFile ? 
                        <div className="text-center">
                           <div className="flex items-center gap-2 text-primary">
                                <FileText />
                                <span className="text-sm font-medium">{documentFile.name}</span>
                           </div>
                            <Button 
                                type="button"
                                variant="outline" 
                                size="sm" 
                                className="mt-4"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent outer div's onClick
                                  triggerFileSelect();
                                }}
                            >
                                <Replace className="mr-2 h-4 w-4" /> 更换文件
                            </Button>
                        </div>
                        : idleContent
                    }
                    </div>
                </div>
                <Input 
                    id="document-upload" 
                    type="file" 
                    className="sr-only" 
                    accept=".pdf,.doc,.docx,.txt"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    disabled={formState !== 'idle'}
                />
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
                 <Button type="submit" className="w-full mt-6" disabled={formState !== 'idle' || !documentFile} variant="warm">
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
                 <Accordion type="multiple" className="w-full space-y-4" defaultValue={Object.keys(groupedCards)}>
                    {Object.entries(groupedCards).map(([chapter, cards]) => (
                        <AccordionItem value={chapter} key={chapter} className="border-none">
                            <Card className="bg-muted/50">
                                <CardHeader className="p-0">
                                    <AccordionTrigger className="flex items-center gap-3 p-4 text-lg font-semibold">
                                        <Folder className="h-5 w-5 text-primary" />
                                        <span>{chapter}</span>
                                        <Badge variant="secondary" className="ml-auto">{cards.length}张卡片</Badge>
                                    </AccordionTrigger>
                                </CardHeader>
                                <AccordionContent className="p-4 pt-0">
                                    <div className="space-y-2">
                                    {cards.map((card, index) => (
                                        <Card key={index} className="bg-background">
                                            <CardContent className="p-4 space-y-3">
                                                 <div className="flex items-start gap-2">
                                                    <FileText className="h-4 w-4 mt-1 text-muted-foreground"/>
                                                    <div className="flex-1">
                                                    {card.type === 'cloze' ? (
                                                        <div dangerouslySetInnerHTML={{ __html: card.content.replace(/{{c1::(.*?)}}/g, '<strong class="text-primary">[$1]</strong>') }} />
                                                    ) : (
                                                        <div>
                                                            <p><strong>问题:</strong> {card.front}</p>
                                                            <p><strong>答案:</strong> {card.back}</p>
                                                        </div>
                                                    )}
                                                    </div>
                                                 </div>
                                                 {card.media && <img src={card.media} alt="Card media" className="max-w-full max-h-48 rounded-md border" />}
                                                <div className="flex gap-2 flex-wrap pt-2 border-t border-dashed">
                                                    {card.tags.map(tag => (
                                                        <span key={tag} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">{tag}</span>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    </div>
                                </AccordionContent>
                            </Card>
                        </AccordionItem>
                    ))}
                 </Accordion>
            </CardContent>
        </Card>
        <div className="flex justify-end gap-4">
             <Button variant="outline" onClick={resetState}>
                <FileUp className="mr-2 h-4 w-4" /> 重新上传
            </Button>
            <Button variant="warm" onClick={handleSaveDeck}>
                <Save className="mr-2 h-4 w-4" />
                确认并保存卡组
            </Button>
        </div>
    </div>
  );
}
