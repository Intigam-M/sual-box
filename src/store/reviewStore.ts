import { create } from "zustand";

interface ReviewCard {
    id: string;
    deck_id: string;
    question: string;
    answer: string;
    created_at: string;
}

interface ReviewState {
    deckFilter: string;
    tagFilter: string;
    cards: ReviewCard[];
    setDeckFilter: (deckId: string) => void;
    setTagFilter: (tagId: string) => void;
    setCards: (cards: ReviewCard[]) => void;
}

export const useReviewStore = create<ReviewState>((set) => ({
    deckFilter: "",
    tagFilter: "",
    cards: [],
    setDeckFilter: (deckId) => set({ deckFilter: deckId }),
    setTagFilter: (tagId) => set({ tagFilter: tagId }),
    setCards: (cards) => set({ cards }),
}));
