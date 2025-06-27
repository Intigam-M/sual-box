import { useQuizStore } from "../../store/quizStore";
import Navbar from "../../components/navbar";
import QuizFilters from "../../components/quizFilters";
import styles from "./quiz.module.css";

function QuizPage() {
    const { cards, currentIndex, flipped, quizFinished, flipCard, markCorrect, markWrong, wrongCards, extraCards } = useQuizStore();

    const currentCard = cards[currentIndex];

    return (
        <div>
            <Navbar />
            <QuizFilters />

            {cards.length === 0 && <div className={styles.message}>No cards found. Please adjust your filters or add some cards.</div>}

            {cards.length > 0 && !quizFinished && currentCard && (
                <div className={styles.quizContainer}>
                    <div className={`${styles.card} ${flipped ? styles.flipped : ""}`} onClick={flipCard}>
                        <div className={styles.cardFront}>{flipped ? currentCard.answer : currentCard.question}</div>
                    </div>

                    <div className={styles.actions}>
                        <button onClick={markCorrect} className={styles.correctBtn}>
                            Correct
                        </button>
                        <button onClick={markWrong} className={styles.wrongBtn}>
                            Wrong
                        </button>
                    </div>

                    <div className={styles.stats}>
                        <p>Remaining: {cards.length - currentIndex - 1}</p>
                        <p>Wrong answers: {wrongCards.length}</p>
                        <p>Extra cards: {extraCards.length}</p>
                        <p>
                            Progress: {currentIndex + 1} / {cards.length}
                        </p>
                    </div>
                </div>
            )}

            {quizFinished && (
                <div className={styles.message}>
                    Quiz completed! ✅ <br />
                    Wrong answers: {wrongCards.length}
                </div>
            )}
        </div>
    );
}

export default QuizPage;
