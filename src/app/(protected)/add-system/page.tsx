"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SYSTEM_DECKS } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { Library, PlusCircle } from "lucide-react";

export default function AddSystemPage() {
    const { toast } = useToast();

    const handleAddDeck = (deckName: string) => {
        // In a real app, this would trigger an API call to copy the deck.
        console.log(`Adding deck: ${deckName}`);
        toast({
            title: "卡组已添加",
            description: `系统卡组 "${deckName}" 已成功复制到你的卡组中。`,
        });
    };

    return (
        <div className="sm:ml-14">
            <div className="flex items-center gap-4 mb-6">
                <Library className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">系统内现有卡组</h1>
            </div>
            <p className="text-muted-foreground mb-8">
                这些是平台预置的卡组，点击添加即可开始学习。
            </p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {SYSTEM_DECKS.map((deck) => (
                    <Card key={deck.id} className="flex flex-col glass-card hover:shadow-primary/20 transition-shadow duration-300">
                        <CardHeader>
                            <CardTitle className="truncate">{deck.name}</CardTitle>
                            <CardDescription>{deck.cards.length} 张卡片</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex items-end">
                            <Button className="w-full" variant="success" onClick={() => handleAddDeck(deck.name)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                添加到我的卡组
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
