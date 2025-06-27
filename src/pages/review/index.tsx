import Navbar from "../../components/navbar";
import ReviewFilters from "../../components/reviewFilters";
import { useReviewStore } from "../../store/reviewStore";
import styles from "./review.module.css";

function ReviewPage() {
    const cards = useReviewStore((state) => state.cards);

    return (
        <div>
            <Navbar />
            <ReviewFilters />

            <div className={styles.message}>
                {cards.length === 0 ? (
                    "No cards found. Please adjust your filters or add some cards."
                ) : (
                    <ul className={styles.cardList}>
                        {cards.map((card) => (
                            <li key={card.id} className={styles.cardItem}>
                                <strong>Q:</strong> {card.question}
                                <br />
                                <strong>A:</strong> {card.answer}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default ReviewPage;
