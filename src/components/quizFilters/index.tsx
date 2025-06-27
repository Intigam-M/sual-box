import { useEffect, useState } from "react";
import { useQuizStore } from "../../store/quizStore";
import { supabase } from "../../lib/supabaseClient";
import { fetchFilteredCards } from "../../lib/fetchCards";
import useAuth from "../../store/authStore";
import styles from "./QuizFilters.module.css";

function QuizFilters() {
    const { user } = useAuth();
    const [decks, setDecks] = useState<any[]>([]);
    const [tags, setTags] = useState<any[]>([]);

    const { selectedDeck, selectedTag, startDate, endDate, setFilters, setCards } = useQuizStore();

    const loadOptions = async () => {
        const [deckRes, tagRes] = await Promise.all([supabase.from("decks").select("*").eq("user_id", user?.id), supabase.from("tags").select("*").eq("user_id", user?.id)]);
        if (deckRes.data) setDecks(deckRes.data);
        if (tagRes.data) setTags(tagRes.data);
    };

    useEffect(() => {
        if (user?.id) loadOptions();
    }, [user]);

    const handleSearch = async () => {
        if (!user?.id) return;
        setFilters(selectedDeck, selectedTag, startDate, endDate);

        try {
            const cards = await fetchFilteredCards(user.id, selectedDeck, selectedTag, startDate, endDate);
            setCards(cards);
        } catch (err) {
            console.error("Error loading cards:", err);
        }
    };

    return (
        <div className={styles.filterContainer}>
            <select value={selectedDeck} onChange={(e) => setFilters(e.target.value, selectedTag, startDate, endDate)} className={styles.select}>
                <option value="">Select Deck</option>
                {decks.map((deck) => (
                    <option key={deck.id} value={deck.id}>
                        {deck.name}
                    </option>
                ))}
            </select>

            <select value={selectedTag} onChange={(e) => setFilters(selectedDeck, e.target.value, startDate, endDate)} className={styles.select}>
                <option value="">Select Tag</option>
                {tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                        {tag.name}
                    </option>
                ))}
            </select>

            <input type="date" value={startDate ?? ""} onChange={(e) => setFilters(selectedDeck, selectedTag, e.target.value, endDate)} className={styles.dateInput} />
            <input type="date" value={endDate ?? ""} onChange={(e) => setFilters(selectedDeck, selectedTag, startDate, e.target.value)} className={styles.dateInput} />

            <button onClick={handleSearch} className={styles.searchBtn}>
                Search
            </button>
        </div>
    );
}

export default QuizFilters;
