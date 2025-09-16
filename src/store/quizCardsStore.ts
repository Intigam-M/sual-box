import { create } from "zustand";
import { CardI } from "../utils/types";

interface QuizCardsStoreI {
    cards: CardI[];
    setCards: (cards: CardI[]) => void;
    deleteCard: (cardId: string) => void;
    resetCards: () => void;
}

const quizCardsStore = create<QuizCardsStoreI>((set) => ({
    cards: [],
    setCards: (cards) => set({ cards }),
    deleteCard: (cardId) => set((state) => ({ cards: state.cards.filter((card) => card.id !== cardId) })),
    resetCards: () => set({ cards: [] }),
}));

export default quizCardsStore;
