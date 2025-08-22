"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Deck, Card as CardType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Flashcard } from './flashcard';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Brain, Clock } from 'lucide-react';
import { NewCardLimitDialog } from './new-card-limit-dialog';

export function StudySession({ deck }: { deck: Deck }) {
    const router = useRouter();
    const [cards, setCards] = useState<CardType[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sessionStats, setSessionStats] = useState({ learned: 0, reviewed: 0 });
    const [showAnswer, setShowAnswer] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showNewCardLimitDialog, setShowNewCardLimitDialog] = useState(false);

    useEffect(() => {
        // Simple scheduler: due cards first, then new cards
        const dueCards = deck.cards.filter(c => !c.isNew && new Date(c.dueAt) <= new Date());
        const newCards = deck.cards.filter(c => c.isNew);
        const scheduledCards = [...dueCards, ...newCards];
        setCards(scheduledCards);
        if (scheduledCards.length === 0) {
            setIsCompleted(true);
        }
    }, [deck]);

    const progress = useMemo(() => {
        if (cards.length === 0) return 0;
        return (currentIndex / cards.length) * 100;
    }, [currentIndex, cards]);

    const handleNextCard = (rating: number) => {
        const currentCard = cards[currentIndex];
        const isNew = currentCard.isNew;
        
        // SM-2 simulation logic
        // This is a placeholder for the actual SM-2 implementation
        console.log(`Card ${currentCard.id} rated ${rating}`);
        
        setShowAnswer(false);
        
        setSessionStats(prev => ({
            learned: isNew ? prev.learned + 1 : prev.learned,
            reviewed: !isNew ? prev.reviewed + 1 : prev.reviewed,
        }));
        
        if (isNew && sessionStats.learned + 1 >= 20) {
             setShowNewCardLimitDialog(true);
             // The dialog will handle moving to the next card or exiting
             return;
        }

        moveToNext();
    };

    const moveToNext = () => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setIsCompleted(true);
        }
    }

    if (isCompleted) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <CheckCircle className="w-20 h-20 text-secondary mb-6" />
                <h1 className="text-3xl font-bold mb-2">卡组学习完成！</h1>
                <p className="text-muted-foreground mb-6">你已经完成了今天这个卡组的所有学习任务。</p>
                <div className="glass-card p-6 mb-8 rounded-lg w-full max-w-md">
                    <h3 className="text-lg font-semibold mb-4 text-primary">本次学习总结</h3>
                    <div className="flex justify-around">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-primary">{sessionStats.learned}</p>
                            <p className="text-muted-foreground">新学卡片</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-secondary">{sessionStats.reviewed}</p>
                            <p className="text-muted-foreground">复习卡片</p>
                        </div>
                    </div>
                </div>
                <Button onClick={() => router.push('/decks')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> 返回卡组列表
                </Button>
            </div>
        );
    }
    
    if (cards.length === 0) {
        return <div className="flex items-center justify-center h-full">正在准备卡片...</div>
    }

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto">
            <header className="flex items-center justify-between p-4 border-b">
                <Button variant="ghost" size="icon" onClick={() => router.push('/decks')}>
                    <ArrowLeft />
                </Button>
                <h1 className="text-xl font-bold truncate mx-4">{deck.name}</h1>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1" title="新学卡片"><Brain size={16} /> {sessionStats.learned}</div>
                    <div className="flex items-center gap-1" title="复习卡片"><Clock size={16} /> {sessionStats.reviewed}</div>
                </div>
            </header>
            
            <div className="w-full px-4 pt-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground text-center mt-1">{currentIndex + 1} / {cards.length}</p>
            </div>

            <div className="flex-grow flex items-center justify-center p-4">
                <Flashcard
                    card={cards[currentIndex]}
                    showAnswer={showAnswer}
                    onShowAnswer={() => setShowAnswer(true)}
                    onRate={handleNextCard}
                />
            </div>
            
            <NewCardLimitDialog
                open={showNewCardLimitDialog}
                onOpenChange={setShowNewCardLimitDialog}
                onContinue={() => {
                    setShowNewCardLimitDialog(false);
                    moveToNext();
                }}
                onReview={() => {
                    // Filter out new cards for the rest of the session
                    setCards(cards.filter(c => !c.isNew));
                    setShowNewCardLimitDialog(false);
                    if(currentIndex >= cards.filter(c => !c.isNew).length) {
                        setIsCompleted(true);
                    }
                }}
                onExit={() => router.push('/decks')}
            />
        </div>
    );
}
