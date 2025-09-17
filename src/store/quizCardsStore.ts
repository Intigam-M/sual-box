import { create } from "zustand";
import { CardI } from "../utils/types";

interface QuizCardsStoreI {
    cards: CardI[];
    flipped: boolean;
    setCards: (cards: CardI[]) => void;
    deleteCard: (cardId: string) => void;
    resetCards: () => void;
    flipCard: () => void;
}

const useQuizCardsStore = create<QuizCardsStoreI>((set) => ({
    cards: [],
    flipped: false,
    setCards: (cards) => set({ cards }),
    deleteCard: (cardId) => set((state) => ({ cards: state.cards.filter((card) => card.id !== cardId) })),
    resetCards: () => set({ cards: [] }),
    flipCard: () => set((state) => ({ flipped: !state.flipped })),
}));

export default useQuizCardsStore;
