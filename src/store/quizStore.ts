import { create } from "zustand";

interface Card {
    id: string;
    deck_id: string;
    question: string;
    answer: string;
    created_at: string;
    tags?: string[];
}

interface QuizState {
    selectedDeck: string;
    selectedTag: string;
    startDate: string | null;
    endDate: string | null;
    cards: Card[];
    setFilters: (deck: string, tag: string, start: string | null, end: string | null) => void;
    setCards: (cards: Card[]) => void;
}

export const useQuizStore = create<QuizState>((set) => ({
    selectedDeck: "",
    selectedTag: "",
    startDate: null,
    endDate: null,
    cards: [],
    setFilters: (deck, tag, start, end) => set({ selectedDeck: deck, selectedTag: tag, startDate: start, endDate: end }),
    setCards: (cards) => set({ cards }),
}));
