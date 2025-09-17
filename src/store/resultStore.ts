import { create } from "zustand";
import { CardI } from "../utils/types";

interface ResultStoreI {
    wrongCards: CardI[];
    correctCards: CardI[];
    extraCards: CardI[];
    totalCards: number;
    setResults: (wrong: CardI[], correct: CardI[], total: number) => void;
    resetResults: () => void;
}

const useResultStore = create<ResultStoreI>((set) => ({
    wrongCards: [],
    correctCards: [],
    totalCards: 0,
    extraCards: [],
    setResults: (wrong, correct, total) =>
        set({
            wrongCards: wrong,
            correctCards: correct,
            totalCards: total,
            extraCards: [],
        }),
    resetResults: () =>
        set({
            wrongCards: [],
            correctCards: [],
            totalCards: 0,
            extraCards: [],
        }),
}));

export default useResultStore;
