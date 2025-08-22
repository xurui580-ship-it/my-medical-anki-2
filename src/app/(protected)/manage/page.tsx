"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { USER_DECKS } from "@/lib/mock-data";
import type { Deck } from "@/lib/types";
import { MoreHorizontal, Settings, Trash2, Edit, PlusCircle, Save } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function EditDeckSheet({ deck }: { deck: Deck }) {
    // This state would be managed by a form library in a real app
    const [cards, setCards] = useState(deck.cards);
    const { toast } = useToast();

    const handleSave = () => {
        // API call to save changes
        console.log("Saving changes for deck:", deck.id, cards);
        toast({ title: "卡片已更新", description: `"${deck.name}" 中的卡片已保存。`});
    }

    const handleAddCard = () => {
        setCards([...cards, { id: `new-${Date.now()}`, q: "", a: "", isNew: true, ease: 2.5, intervalDays: 0, repetitions: 0, dueAt: new Date().toISOString(), history: [] }]);
    }

    const handleRemoveCard = (cardId: string) => {
        setCards(cards.filter(c => c.id !== cardId));
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm"><Edit className="mr-2 h-4 w-4" />编辑卡片</Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>编辑卡组: {deck.name}</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-4">
                    {cards.map((card, index) => (
                        <Card key={card.id} className="relative glass-card">
                             <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleRemoveCard(card.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <CardContent className="p-4 grid gap-2">
                                <div>
                                    <Label>问题 {index + 1}</Label>
                                    <Textarea defaultValue={card.q} />
                                </div>
                                <div>
                                    <Label>答案 {index + 1}</Label>
                                    <Textarea defaultValue={card.a} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                 <div className="flex justify-between mt-4">
                    <Button variant="outline" onClick={handleAddCard}><PlusCircle className="mr-2 h-4 w-4"/>添加卡片</Button>
                    <Button variant="warm" onClick={handleSave}><Save className="mr-2 h-4 w-4"/>保存更改</Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}


export default function ManageDecksPage() {
    const [decks, setDecks] = useState(USER_DECKS);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [deckToDelete, setDeckToDelete] = useState<Deck | null>(null);
    const { toast } = useToast();

    const handleDeleteClick = (deck: Deck) => {
        setDeckToDelete(deck);
        setIsAlertOpen(true);
    };

    const confirmDelete = () => {
        if (deckToDelete) {
            setDecks(decks.filter(d => d.id !== deckToDelete.id));
            toast({
                title: "卡组已删除",
                description: `卡组 "${deckToDelete.name}" 已被永久删除。`,
                variant: "destructive"
            });
        }
        setIsAlertOpen(false);
        setDeckToDelete(null);
    };

    return (
        <div className="sm:ml-14">
            <div className="flex items-center gap-4 mb-6">
                <Settings className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">管理已加入卡组</h1>
            </div>
             <p className="text-muted-foreground mb-8">
                在这里编辑或删除你的卡组。
            </p>

            <Card className="glass-card">
            <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>卡组名称</TableHead>
                        <TableHead className="text-center">卡片数量</TableHead>
                        <TableHead className="text-center">来源</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {decks.map((deck) => (
                        <TableRow key={deck.id}>
                            <TableCell className="font-medium">{deck.name}</TableCell>
                            <TableCell className="text-center">{deck.cards.length}</TableCell>
                            <TableCell className="text-center capitalize">{deck.source}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                <EditDeckSheet deck={deck} />
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(deck)}>
                                    <Trash2 className="mr-2 h-4 w-4" />删除卡组
                                </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </CardContent>
            </Card>

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>确定要删除卡组吗？</AlertDialogTitle>
                        <AlertDialogDescription>
                            此操作无法撤销。卡组 "{deckToDelete?.name}" 及其所有卡片将被永久删除。
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            确认删除
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
