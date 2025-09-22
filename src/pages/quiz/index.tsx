import Navbar from "../../components/navbar";
import QuizFilters from "../../components/quizFilters";
import styles from "./quiz.module.css";
import useQuizCardsStore from "../../store/quizCardsStore";

function QuizPage() {
    const {
        cards,
        flipped,
        currentIndex,
        wrongCards,
        correctAnswerCount,
        extraCards,
        quizFinished,
        countExtraCards,
        flipCard,
        nextCard,
        markWrong,
    } = useQuizCardsStore();

    const currentCard = cards[currentIndex];

    return (
        <div>
            <Navbar />
            <QuizFilters page="quiz" />

            {cards.length === 0 && (
                <div className={styles.noCardMsg}>No cards found. Please adjust your filters or add some cards.</div>
            )}

            {cards.length > 0 && !quizFinished && currentCard && (
                <div className={styles.quizContainer}>
                    <div className={`${styles.card} ${flipped ? styles.flipped : ""}`} onClick={flipCard}>
                        <div className={styles.cardFront}>{flipped ? currentCard.answer : currentCard.question}</div>
                    </div>

                    <div className={styles.actions}>
                        <button onClick={() => nextCard("correct")} className={styles.correctBtn}>
                            Correct
                        </button>
                        <button onClick={markWrong} className={styles.wrongBtn}>
                            Wrong
                        </button>
                    </div>
                    <div className={styles.stats}>
                        <p>
                            Progress: {currentIndex + 1} /{" "}
                            {extraCards.length > 0 ? cards.length + extraCards.length : cards.length}
                        </p>
                        <p>Correct answers: {correctAnswerCount}</p>
                        <p>Wrong answers: {wrongCards.length}</p>
                        <p>Extra cards: {countExtraCards}</p>
                    </div>
                </div>
            )}

            {quizFinished && (
                <div className={styles.result}>
                    <span>Quiz completed! ✅</span>
                    <hr />

                    <p>
                        Total questions answered: <b>{cards.length}</b>
                    </p>
                    <p>
                        Correct answers: <b>{correctAnswerCount}</b>
                    </p>
                    <p>
                        Wrong answers: <b>{wrongCards.length}</b>
                    </p>
                    <p>
                        Extra cards added: <b>{countExtraCards}</b>
                    </p>
                </div>
            )}
        </div>
    );
}

export default QuizPage;
