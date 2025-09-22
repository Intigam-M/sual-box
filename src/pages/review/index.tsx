import Navbar from "../../components/navbar";
import styles from "./review.module.css";
import Swal from "sweetalert2";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import QuizFilters from "../../components/quizFilters";
import useQuizCardsStore from "../../store/quizCardsStore";
import { useEffect } from "react";

function ReviewPage() {
    const { totalCardCount, cards, getTotalCardCount, updateCard, deleteCard, setCards } = useQuizCardsStore();

    useEffect(() => {
        getTotalCardCount();
        setCards([], "review");
    }, []);

    const handleEdit = async (card: any) => {
        const { value: formValues } = await Swal.fire({
            title: "Edit Card",
            html: `
            <input id="swal-question" class="swal2-input" placeholder="Question" value="${card.question}" />
            <input id="swal-answer" class="swal2-input" placeholder="Answer" value="${card.answer}" />
        `,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                const question = (document.getElementById("swal-question") as HTMLInputElement).value;
                const answer = (document.getElementById("swal-answer") as HTMLInputElement).value;
                if (!question || !answer) {
                    Swal.showValidationMessage("Both fields are required");
                }
                return { question, answer };
            },
        });

        if (!formValues) return;

        await updateCard(card.id, formValues.question, formValues.answer);
    };

    const handleDelete = async (cardId: string) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: `This card will be deleted!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "Cancel",
        });

        if (!confirm.isConfirmed) return;
        await deleteCard(cardId);
    };
    return (
        <div>
            <Navbar />
            <QuizFilters page="review" />

            <p className={styles.resultCount}>
                Showing {cards.length} of {totalCardCount} cards
            </p>

            <div>
                {cards.length === 0 ? (
                    <p className={styles.message}>No cards found. Please adjust your filters or add some cards</p>
                ) : (
                    <ul className={styles.cardList}>
                        {cards.map((card) => (
                            <li key={card.id} className={styles.cardItem}>
                                <div>
                                    <div className={styles.answerDiv}>{card.answer}</div>
                                    <div className={styles.questionDiv}>{card.question}</div>
                                </div>
                                <div>
                                    <span className={styles.cardDate}>
                                        {(() => {
                                            const utcDate = new Date(card.created_at);
                                            const bakuOffsetMs = 4 * 60 * 60 * 1000; // 4 saat fərq (UTC+4)
                                            const bakuDate = new Date(utcDate.getTime() + bakuOffsetMs);

                                            const dateStr = bakuDate.toLocaleDateString("az-AZ", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            });

                                            const timeStr = bakuDate.toLocaleTimeString("az-AZ", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                                hour12: false,
                                            });

                                            return `${dateStr} ${timeStr}`;
                                        })()}
                                    </span>
                                    <div className={styles.cardActions}>
                                        <button className={`${styles.actionBtn}`} onClick={() => handleEdit(card)}>
                                            <MdEdit size={20} color="blue" />
                                        </button>
                                        <button className={`${styles.actionBtn}`} onClick={() => handleDelete(card.id)}>
                                            <MdDelete size={20} color="red" />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default ReviewPage;
