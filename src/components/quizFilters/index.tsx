import { useEffect } from "react";
import { useQuizStore } from "../../store/quizStore";
import { fetchFilteredCards } from "../../lib/fetchCards";
import useAuth from "../../store/authStore";
import styles from "./quizFilters.module.css";
import useDeckStore from "../../store/deckStore";
import useTagStore from "../../store/tagStore";

function QuizFilters() {
    const { user } = useAuth();
    const { selectedDeck, selectedTag, startDate, endDate, setFilters, setCards } = useQuizStore();

    const fetchDescs = useDeckStore((state) => state.fetchDescs);
    const fetchTags = useTagStore((state) => state.fetchTags);
    const decks = useDeckStore((state) => state.descs);
    const tags = useTagStore((state) => state.tags);

    useEffect(() => {
        fetchDescs();
        fetchTags();
    }, []);

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
            <select
                value={selectedDeck}
                onChange={(e) => setFilters(e.target.value, selectedTag, startDate, endDate)}
                className={styles.select}
            >
                <option value="">Select Deck</option>
                {decks.map((deck) => (
                    <option key={deck.id} value={deck.id}>
                        {deck.name}
                    </option>
                ))}
            </select>

            <select
                value={selectedTag}
                onChange={(e) => setFilters(selectedDeck, e.target.value, startDate, endDate)}
                className={styles.select}
            >
                <option value="">Select Tag</option>
                {tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                        {tag.name}
                    </option>
                ))}
            </select>

            <input
                type="date"
                value={startDate ?? ""}
                onChange={(e) => setFilters(selectedDeck, selectedTag, e.target.value, endDate)}
                className={styles.dateInput}
            />
            <input
                type="date"
                value={endDate ?? ""}
                onChange={(e) => setFilters(selectedDeck, selectedTag, startDate, e.target.value)}
                className={styles.dateInput}
            />

            <button onClick={handleSearch} className={styles.searchBtn}>
                Start Quiz
            </button>
        </div>
    );
}

export default QuizFilters;
