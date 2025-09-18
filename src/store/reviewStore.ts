import { create } from "zustand";
import { TagI } from "../utils/types";

interface ReviewCard {
    id: string;
    deck_id: string;
    question: string;
    answer: string;
    created_at: string;
    card_tags: TagI[];
}

interface ReviewState {
    deckFilter: string;
    tagFilter: string;
    cards: ReviewCard[];
    startDate: string | null;
    endDate: string | null;
    searchText: string;
    totalCardCount: number;
    setTotalCardCount: (count: number) => void;
    setSearchText: (text: string) => void;
    setStartDate: (date: string | null) => void;
    setEndDate: (date: string | null) => void;
    setDeckFilter: (deckId: string) => void;
    setTagFilter: (tagId: string) => void;
    setCards: (cards: ReviewCard[]) => void;
}

export const useReviewStore = create<ReviewState>((set) => ({
    deckFilter: "",
    tagFilter: "",
    cards: [],
    startDate: null,
    endDate: null,
    searchText: "",
    totalCardCount: 0,
    setTotalCardCount: (count) => set({ totalCardCount: count }),
    setSearchText: (text) => set({ searchText: text }),
    setStartDate: (date) => set({ startDate: date }),
    setEndDate: (date) => set({ endDate: date }),
    setDeckFilter: (deckId) => set({ deckFilter: deckId }),
    setTagFilter: (tagId) => set({ tagFilter: tagId }),
    setCards: (cards) => set({ cards }),
}));
