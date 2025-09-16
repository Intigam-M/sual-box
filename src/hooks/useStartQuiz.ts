import { useEffect } from "react";
import quizCardsStore from "../store/quizCardsStore";

const useStartQuiz = () => {
    const quizCards = quizCardsStore((state) => state.cards);
};

export default useStartQuiz;
