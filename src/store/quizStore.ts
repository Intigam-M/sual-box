import { create } from "zustand";
import { supabase } from "../lib/supabaseClient";
import { CardI } from "../utils/types";

interface QuizState {
    selectedDeck: string;
    selectedTag: string;
    startDate: string | null;
    endDate: string | null;
    cards: CardI[];
    extraCards: CardI[];
    currentIndex: number;
    flipped: boolean;
    wrongCards: CardI[];
    allUsedCardIds: Set<string>;
    quizFinished: boolean;

    setFilters: (deck: string, tag: string, start: string | null, end: string | null) => void;
    setCards: (cards: CardI[]) => void;
    flipCard: () => void;
    markCorrect: () => void;
    markWrong: () => void;
    resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
    selectedDeck: "",
    selectedTag: "",
    startDate: null,
    endDate: null,
    cards: [],
    extraCards: [],
    currentIndex: 0,
    flipped: false,
    wrongCards: [],
    allUsedCardIds: new Set(),
    quizFinished: false,

    setFilters: (deck, tag, start, end) =>
        set({
            selectedDeck: deck,
            selectedTag: tag,
            startDate: start,
            endDate: end,
        }),

    setCards: (cards: CardI[]) => {
        const used = new Set(cards.map((c) => c.id));
        set({
            cards: shuffleArray(cards),
            currentIndex: 0,
            flipped: false,
            wrongCards: [],
            extraCards: [],
            allUsedCardIds: used,
            quizFinished: false,
        });
    },

    flipCard: () => set((state) => ({ flipped: !state.flipped })),

    markCorrect: () => {
        const { currentIndex, cards, extraCards } = get();
        const isMainDone = currentIndex + 1 >= cards.length;

        if (isMainDone) {
            if (extraCards.length > 0) {
                const newCards = [...cards, ...shuffleArray(extraCards)];
                const used = new Set(newCards.map((c) => c.id));
                set({
                    cards: newCards,
                    extraCards: [],
                    currentIndex: cards.length, // əlavə kartlardan başlayır
                    flipped: false,
                    allUsedCardIds: used,
                });
            } else {
                set({ quizFinished: true });
            }
        } else {
            set((state) => ({
                currentIndex: state.currentIndex + 1,
                flipped: false,
            }));
        }
    },

    markWrong: async () => {
        const { cards, currentIndex, wrongCards, extraCards, allUsedCardIds, selectedDeck } = get();

        const currentCard = cards[currentIndex];
        if (!currentCard || !selectedDeck) return;

        const newExtra = await fetchExtraCardsFromSupabase(selectedDeck, allUsedCardIds);

        newExtra.forEach((c) => allUsedCardIds.add(c.id));

        set({
            wrongCards: [...wrongCards, currentCard],
            extraCards: [...extraCards, ...newExtra],
        });

        get().markCorrect(); // növbəti karta keç
    },

    resetQuiz: () =>
        set((state) => ({
            currentIndex: 0,
            flipped: false,
            wrongCards: [],
            extraCards: [],
            quizFinished: false,
            allUsedCardIds: new Set(state.cards.map((c) => c.id)),
        })),
}));

// Helper: kartları qarışdırmaq
function shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
}

// Helper: yeni kartları gətir
async function fetchExtraCardsFromSupabase(deckId: string, exclude: Set<string>): Promise<CardI[]> {
    const { data, error } = await supabase.from("cards").select("*").eq("deck_id", deckId);

    if (error || !data) return [];

    const filtered = data.filter((card) => !exclude.has(card.id));
    return shuffleArray(filtered).slice(0, 5);
}
