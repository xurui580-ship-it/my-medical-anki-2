import type { Card as CardType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface FlashcardProps {
    card: CardType;
    showAnswer: boolean;
    onShowAnswer: () => void;
    onRate: (rating: number) => void;
}

const ratingOptions = [
    { label: '生疏', value: 1, color: 'destructive' as const },
    { label: '困难', value: 2, color: 'warm' as const },
    { label: '一般', value: 3, color: 'default' as const },
    { label: '熟练', value: 4, color: 'success' as const },
];

export function Flashcard({ card, showAnswer, onShowAnswer, onRate }: FlashcardProps) {
    return (
        <div className="w-full max-w-2xl flex flex-col items-center">
            <Card className="w-full glass-card min-h-[300px] flex flex-col">
                <CardContent className="p-6 flex-grow flex flex-col justify-center items-center text-center">
                    <p className="text-muted-foreground mb-4">问题</p>
                    <p className="text-2xl md:text-3xl font-semibold">{card.q}</p>
                </CardContent>
                {showAnswer && (
                    <>
                        <div className="border-t border-dashed my-2" />
                        <CardContent className="p-6 flex-grow flex flex-col justify-center items-center text-center">
                            <p className="text-muted-foreground mb-4">答案</p>
                            <p className="text-xl md:text-2xl">{card.a}</p>
                        </CardContent>
                    </>
                )}
            </Card>

            <div className="mt-8 w-full">
                {showAnswer ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {ratingOptions.map(option => (
                             <Button
                                key={option.value}
                                variant={option.color}
                                className="h-12 text-md"
                                onClick={() => onRate(option.value)}
                            >
                                {option.label}
                            </Button>
                        ))}
                    </div>
                ) : (
                    <Button onClick={onShowAnswer} className="w-full h-14 text-lg" variant="warm">
                        显示答案
                    </Button>
                )}
            </div>
        </div>
    );
}
