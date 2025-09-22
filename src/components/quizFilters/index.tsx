import { useEffect } from "react";
import { fetchFilteredCards } from "../../services/cards.service";
import useAuth from "../../store/authStore";
import styles from "./quizFilters.module.css";
import useDeckStore from "../../store/deckStore";
import useTagStore from "../../store/tagStore";
import useFiltersStore from "../../store/filtersStore";
import { FilterDataI } from "../../utils/types";
import useQuizCardsStore from "../../store/quizCardsStore";
import toast from "react-hot-toast";

function QuizFilters({ page }: { page: string }) {
    const { user } = useAuth();
    const { selectedDeck, selectedTag, startDate, endDate, setFilters } = useFiltersStore();

    const fetchDecks = useDeckStore((state) => state.fetchDecks);
    const fetchTags = useTagStore((state) => state.fetchTags);
    const setCards = useQuizCardsStore((state) => state.setCards);
    const resetQuiz = useQuizCardsStore((state) => state.resetQuiz);
    const decks = useDeckStore((state) => state.descs);
    const tags = useTagStore((state) => state.tags);

    useEffect(() => {
        fetchDecks();
        fetchTags();
    }, []);

    const handleSearch = async () => {
        if (!user?.id) return;

        if (!selectedDeck) {
            toast.error("Please select a deck to start the quiz.");
            return;
        }

        resetQuiz();

        const filterData: FilterDataI = {
            selectedDeck,
            selectedTag,
            startDate,
            endDate,
        };

        try {
            const cards = await fetchFilteredCards(user.id, filterData);
            setCards(cards, page);
        } catch (err) {
            console.error("Error loading cards:", err);
        }
    };

    return (
        <div className={styles.filterContainer}>
            <select
                value={selectedDeck ?? ""}
                onChange={(e) => setFilters({ selectedDeck: e.target.value })}
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
                value={selectedTag ?? ""}
                onChange={(e) => setFilters({ selectedTag: e.target.value })}
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
                onChange={(e) => setFilters({ startDate: e.target.value })}
                className={styles.dateInput}
            />
            <input
                type="date"
                value={endDate ?? ""}
                onChange={(e) => setFilters({ endDate: e.target.value })}
                className={styles.dateInput}
            />

            <button onClick={handleSearch} className={styles.searchBtn}>
                {page === "quiz" ? "Start Quiz" : "Apply Filters"}
            </button>
        </div>
    );
}

export default QuizFilters;
