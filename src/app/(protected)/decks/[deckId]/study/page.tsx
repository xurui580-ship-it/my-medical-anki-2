import { StudySession } from "@/components/study/study-session";
import { USER_DECKS, SYSTEM_DECKS } from "@/lib/mock-data";
import { BrainIcon } from "@/components/shared/icons";

export default function StudyPage({ params }: { params: { deckId: string } }) {
    const allDecks = [...USER_DECKS, ...SYSTEM_DECKS];
    const deck = allDecks.find(d => d.id === params.deckId);

    if (!deck) {
        return (
            <div className="sm:ml-14 flex flex-col items-center justify-center h-full text-center">
                <BrainIcon className="w-16 h-16 text-destructive mb-4" />
                <h1 className="text-2xl font-bold">卡组未找到</h1>
                <p className="text-muted-foreground">无法找到ID为 {params.deckId} 的卡组。</p>
            </div>
        )
    }

    return (
        <div className="sm:ml-14 h-full">
            <StudySession deck={deck} />
        </div>
    );
}
