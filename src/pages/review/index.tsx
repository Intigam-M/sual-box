import Navbar from "../../components/navbar";
import ReviewFilters from "../../components/reviewFilters";
import { useReviewStore } from "../../store/reviewStore";
import styles from "./review.module.css";
import { useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import Swal from "sweetalert2";
import useAuth from "../../store/authStore";

function ReviewPage() {
    const { user } = useAuth();
    const { deckFilter, tagFilter, setCards, cards, startDate, endDate, searchText } = useReviewStore();

    // Kartları gətirən funksiya
    const refetchCards = async () => {
        if (!user?.id) return;

        let query = supabase.from("cards").select("*, card_tags(tag_id)").eq("user_id", user.id);

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
            Swal.fire("Error", "Redaktə mümkün olmadı", "error");
        } else {
            Swal.fire("Uğurlu", "Kart yeniləndi", "success");
            refetchCards();
        }
    };

    // 💡 Silmək funksiyası
    const handleDelete = async (cardId: string) => {
        const confirm = await Swal.fire({
            title: "Əminsiniz?",
            text: "Bu kart silinəcək!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Bəli, sil",
        });

        if (!confirm.isConfirmed) return;

        const { error } = await supabase.from("cards").delete().eq("id", cardId);

        if (error) {
            Swal.fire("Xəta", "Silinmə zamanı problem oldu", "error");
        } else {
            Swal.fire("Silindi", "Kart uğurla silindi", "success");
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
                                <strong>Q:</strong> {card.question}
                                <br />
                                <strong>A:</strong> {card.answer}
                                <br />
                                date:{" "}
                                {new Date(card.created_at).toLocaleDateString("az-AZ", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    timeZone: "Asia/Baku",
                                })}
                                <div className={styles.cardActions}>
                                    <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => handleEdit(card)}>
                                        Edit
                                    </button>
                                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(card.id)}>
                                        Delete
                                    </button>
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
