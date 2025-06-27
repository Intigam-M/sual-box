import Navbar from "../../components/navbar";
import QuizFilters from "../../components/quizFilters";
import styles from "./quiz.module.css";

function QuizPage() {
    return (
        <div>
            <Navbar />
            <QuizFilters />
            <div className={styles.message}>No cards found. Please adjust your filters or add some cards.</div>
        </div>
    );
}

export default QuizPage;
