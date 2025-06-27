import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useReviewStore } from "../../store/reviewStore";
import useAuth from "../../store/authStore";
import styles from "./ReviewFilters.module.css";

function ReviewFilters() {
    const { user } = useAuth();
    const [decks, setDecks] = useState<any[]>([]);
    const [tags, setTags] = useState<any[]>([]);

    const { deckFilter, tagFilter, setDeckFilter, setTagFilter, setCards, startDate, endDate, setStartDate, setEndDate, searchText, setSearchText } = useReviewStore();

    useEffect(() => {
        const fetchFilters = async () => {
            const [deckRes, tagRes] = await Promise.all([supabase.from("decks").select("*").eq("user_id", user?.id), supabase.from("tags").select("*").eq("user_id", user?.id)]);
            if (deckRes.data) setDecks(deckRes.data);
            if (tagRes.data) setTags(tagRes.data);
        };
        if (user?.id) fetchFilters();
    }, [user]);

    useEffect(() => {
        const fetchCards = async () => {
            if (!user?.id) return;

            let query = supabase.from("cards").select("*, card_tags(tag_id)").eq("user_id", user.id);

            if (deckFilter) query = query.eq("deck_id", deckFilter);

            const { data, error } = await query;
            if (!data || error) return setCards([]);

            let filtered = data;
            if (tagFilter) {
                filtered = data.filter((card: any) => card.card_tags?.some((ct: any) => ct.tag_id === tagFilter));
            }

            setCards(filtered);
        };

        fetchCards();
    }, [deckFilter, tagFilter, user, setCards]);

    return (
        <div className={styles.filterContainer}>
            <select value={deckFilter} onChange={(e) => setDeckFilter(e.target.value)} className={styles.select}>
                <option value="">All Decks</option>
                {decks.map((deck) => (
                    <option key={deck.id} value={deck.id}>
                        {deck.name}
                    </option>
                ))}
            </select>

            <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} className={styles.select}>
                <option value="">All Tags</option>
                {tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                        {tag.name}
                    </option>
                ))}
            </select>
            <input type="text" placeholder="Search by question" value={searchText} onChange={(e) => setSearchText(e.target.value)} className={styles.select} />

            <input type="date" className={styles.select} value={startDate ?? ""} onChange={(e) => setStartDate(e.target.value || null)} />

            <input type="date" className={styles.select} value={endDate ?? ""} onChange={(e) => setEndDate(e.target.value || null)} />
        </div>
    );
}

export default ReviewFilters;
