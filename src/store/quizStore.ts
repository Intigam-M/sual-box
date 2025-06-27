import { create } from "zustand";
import { CardI } from "../utils/types";

interface QuizState {
    // Əvvəlki sahələr
    selectedDeck: string;
    selectedTag: string;
    startDate: string | null;
    endDate: string | null;
    cards: CardI[];
    setFilters: (...args: [string, string, string | null, string | null]) => void;
    setCards: (cards: CardI[]) => void;

    // Yeni sahələr
    currentIndex: number;
    flipped: boolean;
    wrongCards: CardI[];
    quizFinished: boolean;
    flipCard: () => void;
    markCorrect: () => void;
    markWrong: () => void;
    resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
    // Əvvəlki sahələr
    selectedDeck: "",
    selectedTag: "",
    startDate: null,
    endDate: null,
    cards: [],
    setFilters: (deck, tag, start, end) => set({ selectedDeck: deck, selectedTag: tag, startDate: start, endDate: end }),
    setCards: (cards) =>
        set({
            cards: shuffleArray(cards),
            currentIndex: 0,
            flipped: false,
            wrongCards: [],
            quizFinished: false,
        }),

    // Yeni sahələr
    currentIndex: 0,
    flipped: false,
    wrongCards: [],
    quizFinished: false,

    flipCard: () => set((state) => ({ flipped: !state.flipped })),

    markCorrect: () => {
        const { currentIndex, cards } = get();
        if (currentIndex + 1 >= cards.length) {
            set({ quizFinished: true });
        } else {
            set({ currentIndex: currentIndex + 1, flipped: false });
        }
    },

    markWrong: () => {
        const { currentIndex, cards, wrongCards } = get();
        const currentCard = cards[currentIndex];
        set({
            wrongCards: [...wrongCards, currentCard],
        });
        get().markCorrect(); // sonra irəli keç
    },

    resetQuiz: () =>
        set({
            currentIndex: 0,
            flipped: false,
            wrongCards: [],
            quizFinished: false,
        }),
}));

// Kartları random qaydada düzür:
function shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
}
