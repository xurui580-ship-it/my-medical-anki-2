"use client";

import { StudySession } from "@/components/study/study-session";
import { useDecks } from "@/contexts/DeckContext";
import { BrainIcon } from "@/components/shared/icons";
import { useEffect, useState } from "react";
import type { Deck } from "@/lib/types";

export default function StudyPage({ params }: { params: { deckId: string } }) {
    const { getDeckById } = useDecks();
    const [deck, setDeck] = useState<Deck | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const foundDeck = getDeckById(params.deckId);
        setDeck(foundDeck);
        setLoading(false);
    }, [getDeckById, params.deckId]);


    if (loading) {
        return (
             <div className="sm:ml-14 flex flex-col items-center justify-center h-full text-center">
                <BrainIcon className="w-16 h-16 text-primary animate-pulse" />
                <p className="text-muted-foreground mt-4">正在加载卡组...</p>
            </div>
        )
    }

    if (!deck) {
        return (
            <div className="sm:ml-14 flex flex-col items-center justify-center h-full text-center">
                <BrainIcon className="w-16 h-16 text-destructive mb-4" />
                <h1 className="text-2xl font-bold">卡组未找到</h1>
                <p className="text-muted-foreground">无法在您的卡组中找到ID为 {params.deckId} 的卡组。</p>
            </div>
        )
    }

    return (
        <div className="sm:ml-14 h-full">
            <StudySession deck={deck} />
        </div>
    );
}
