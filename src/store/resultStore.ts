import { create } from "zustand";
import { CardI } from "../utils/types";

interface ResultStoreI {
    wrongCards: CardI[];
    correctCards: CardI[];
    extraCards: CardI[];
    markCorrect: () => void;
    markWrong: () => void;
}

const useResultStore = create<ResultStoreI>((set) => ({
    wrongCards: [],
    correctCards: [],
    extraCards: [],

    markCorrect: () =>
        set((state) => ({
            correctCards: [...state.correctCards, state.wrongCards[0]],
            wrongCards: state.wrongCards.slice(1),
        })),
    markWrong: () =>
        set((state) => ({
            extraCards: [...state.extraCards, state.wrongCards[0]],
            wrongCards: state.wrongCards.slice(1),
        })),
}));

export default useResultStore;
