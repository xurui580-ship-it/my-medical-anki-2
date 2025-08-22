"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Save, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const cardSchema = z.object({
  q: z.string().min(1, "问题不能为空"),
  a: z.string().min(1, "答案不能为空"),
});

const deckSchema = z.object({
  name: z.string().min(1, "卡组名称不能为空"),
  cards: z.array(cardSchema).min(1, "至少需要一张卡片"),
});

export default function AddManualPage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof deckSchema>>({
    resolver: zodResolver(deckSchema),
    defaultValues: {
      name: "",
      cards: [{ q: "", a: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "cards",
  });

  const onSubmit = (data: z.infer<typeof deckSchema>) => {
    // In a real app, you'd send this to your backend.
    console.log(data);
    toast({
      title: "卡组已保存",
      description: `卡组 "${data.name}" 已成功创建。`,
    });
    router.push("/decks");
  };

  return (
    <div className="sm:ml-14">
      <h1 className="text-3xl font-bold tracking-tight mb-6">手动添加新卡组</h1>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle>卡组信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="deck-name">卡组名称</Label>
              <Input id="deck-name" placeholder="例如：临床诊断学" {...form.register("name")} />
              {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
            </div>
          </CardContent>
        </Card>

        {fields.map((field, index) => (
          <Card key={field.id} className="glass-card mb-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>卡片 {index + 1}</CardTitle>
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor={`cards[${index}].q`}>问题 (Q)</Label>
                <Textarea id={`cards[${index}].q`} placeholder="输入问题..." {...form.register(`cards.${index}.q`)} />
                {form.formState.errors.cards?.[index]?.q && <p className="text-sm text-destructive">{form.formState.errors.cards?.[index]?.q?.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`cards[${index}].a`}>答案 (A)</Label>
                <Textarea id={`cards[${index}].a`} placeholder="输入答案..." {...form.register(`cards.${index}.a`)} />
                {form.formState.errors.cards?.[index]?.a && <p className="text-sm text-destructive">{form.formState.errors.cards?.[index]?.a?.message}</p>}
              </div>
            </CardContent>
          </Card>
        ))}
         {form.formState.errors.cards && typeof form.formState.errors.cards === 'object' && 'message' in form.formState.errors.cards && (
            <p className="text-sm text-destructive mt-2 mb-2">{form.formState.errors.cards.message}</p>
        )}

        <div className="flex justify-between items-center mt-6">
          <Button type="button" variant="outline" onClick={() => append({ q: "", a: "" })}>
            <PlusCircle className="mr-2 h-4 w-4" />
            添加卡片
          </Button>
          <Button type="submit" variant="warm">
            <Save className="mr-2 h-4 w-4" />
            保存卡组
          </Button>
        </div>
      </form>
    </div>
  );
}
