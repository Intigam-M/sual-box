import { create } from "zustand";
import { CardI } from "../utils/types";
import { shuffleArray } from "../utils/helpers/shuffleArray";
import {
    fetchExtraCardsFromSupabase,
    fetchTotalCardCount,
    updateCardService,
    deleteCardService,
} from "../services/cards.service";
import useAuth from "./authStore";
import useFiltersStore from "./filtersStore";
import { toast } from "react-hot-toast";

interface QuizCardsStoreI {
    cards: CardI[];
    extraCards: CardI[];
    countExtraCards: number;
    wrongCards: CardI[];
    correctAnswerCount: number;
    currentIndex: number;
    flipped: boolean;
    allUsedCardIds: Set<string>;
    quizFinished: boolean;
    totalCardCount: number;
    setCards: (cards: CardI[], page: string) => void;
    nextCard: (answerType: "correct" | "wrong") => void;
    markWrong: () => void;
    flipCard: () => void;
    resetQuiz: () => void;
    getTotalCardCount: () => Promise<void>;
    updateCard: (cardId: string, question: string, answer: string) => Promise<void>;
    deleteCard: (cardId: string) => Promise<void>;
}

const useQuizCardsStore = create<QuizCardsStoreI>((set, get) => ({
    cards: [],
    extraCards: [],
    countExtraCards: 0,
    wrongCards: [],
    correctAnswerCount: 0,
    currentIndex: 0,
    flipped: false,
    allUsedCardIds: new Set(),
    quizFinished: false,
    totalCardCount: 0,
    setCards: (cards, page) => {
        if (page === "review") {
            set({
                cards,
            });
        } else {
            set({
                cards: shuffleArray(cards),
                allUsedCardIds: new Set(cards.map((c) => c.id)),
            });
        }
    },

    nextCard: (answerType) => {
        const { currentIndex, cards, extraCards, correctAnswerCount } = get();

        if (answerType === "correct") {
            set({ correctAnswerCount: correctAnswerCount + 1 });
        }
        const isMainDone = currentIndex + 1 >= cards.length;

        if (isMainDone) {
            if (extraCards.length > 0) {
                const newCards = [...cards, ...shuffleArray(extraCards)];
                set({
                    cards: newCards,
                    extraCards: [],
                    currentIndex: cards.length, // əlavə kartlardan başlayır
                    flipped: false,
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
        const selectedDeck = useFiltersStore.getState().selectedDeck;
        const { cards, currentIndex, wrongCards, extraCards, allUsedCardIds, countExtraCards } = get();

        const currentCard = cards[currentIndex];

        set({ wrongCards: [...wrongCards, currentCard] });

        if (!currentCard || !selectedDeck) return;

        const newExtra = await fetchExtraCardsFromSupabase(
            selectedDeck,
            allUsedCardIds || "",
            useAuth.getState().user?.id || ""
        );

        if (newExtra.length === 0) {
            toast.error("No more extra cards available in this deck.");
        } else {
            toast.success(`${newExtra.length} extra cards added.`);
        }

        set({
            extraCards: [...extraCards, ...newExtra],
            allUsedCardIds: new Set([...allUsedCardIds, ...newExtra.map((c) => c.id)]),
            countExtraCards: countExtraCards + newExtra.length,
        });

        get().nextCard("wrong");
    },

    flipCard: () => set((state) => ({ flipped: !state.flipped })),
    resetQuiz: () =>
        set({
            cards: [],
            extraCards: [],
            wrongCards: [],
            currentIndex: 0,
            flipped: false,
            allUsedCardIds: new Set(),
            quizFinished: false,
            countExtraCards: 0,
            correctAnswerCount: 0,
        }),

    getTotalCardCount: async () => {
        const userId = useAuth.getState().user?.id;
        if (!userId) return;
        const count = await fetchTotalCardCount(userId);
        set({ totalCardCount: count });
    },

    updateCard: async (cardId, question, answer) => {
        try {
            await updateCardService(cardId, question, answer);
            toast.success("Card updated successfully");
            set((state) => ({
                cards: state.cards.map((card) => (card.id === cardId ? { ...card, question, answer } : card)),
            }));
        } catch (error) {
            toast.error("Failed to update card");
        }
    },

    deleteCard: async (cardId) => {
        try {
            await deleteCardService(cardId);
            toast.success("Card deleted successfully");
            set((state) => ({
                cards: state.cards.filter((card) => card.id !== cardId),
                totalCardCount: state.totalCardCount - 1,
            }));
        } catch (error) {
            toast.error("An error occurred while deleting the card");
        }
    },
}));

export default useQuizCardsStore;
