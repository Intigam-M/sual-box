import { useQuizStore } from "../../store/quizStore";
import Navbar from "../../components/navbar";
import QuizFilters from "../../components/quizFilters";
import styles from "./quiz.module.css";

function QuizPage() {
    const cards = useQuizStore((state) => state.cards);

    return (
        <div>
            <Navbar />
            <QuizFilters />
            <div className={styles.message}>{cards.length === 0 ? "No cards found. Please adjust your filters or add some cards." : `Found ${cards.length} cards. Ready to start quiz!`}</div>
        </div>
    );
}

export default QuizPage;
