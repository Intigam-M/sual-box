import Navbar from "../../components/navbar";
import ReviewFilters from "../../components/reviewFilters";
import { useReviewStore } from "../../store/reviewStore";
import styles from "./review.module.css";
import { useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import Swal from "sweetalert2";
import useAuth from "../../store/authStore";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { toast } from "react-hot-toast";

function ReviewPage() {
    const { user } = useAuth();
    const { deckFilter, tagFilter, setCards, cards, startDate, endDate, searchText } = useReviewStore();

    // Kartları gətirən funksiya
    const refetchCards = async () => {
        if (!user?.id) return;

        let query = supabase.from("cards").select("*, card_tags(tag_id)").eq("user_id", user.id).order("created_at", { ascending: false });

        if (deckFilter) query = query.eq("deck_id", deckFilter);
        if (startDate) query = query.gte("created_at", startDate);
        if (endDate) query = query.lte("created_at", endDate);

        const { data, error } = await query;
        if (!data || error) return setCards([]);

        let filtered = data;
        if (tagFilter) {
            filtered = data.filter((card: any) => card.card_tags?.some((ct: any) => ct.tag_id === tagFilter));
        }

        if (searchText.trim()) {
            const text = searchText.trim().toLowerCase();
            filtered = filtered.filter((card: any) => card.question.toLowerCase().includes(text));
        }

        setCards(filtered);
    };

    useEffect(() => {
        refetchCards();
    }, [deckFilter, tagFilter, startDate, endDate, user, searchText]);

    // Redaktə funksiyası
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

        const { error } = await supabase.from("cards").update({ question: formValues.question, answer: formValues.answer }).eq("id", card.id);

        if (error) {
            toast.error("Failed to update card");
        } else {
            toast.success("Card updated successfully");
        }
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

        const { error } = await supabase.from("cards").delete().eq("id", cardId);

        if (error) {
            toast.error("An error occurred while deleting the card");
        } else {
            toast.success("Card deleted successfully");
            refetchCards();
        }
    };
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
                                <div>
                                    <strong>Q:</strong> {card.question}
                                    <br />
                                    <strong>A:</strong> {card.answer}
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
