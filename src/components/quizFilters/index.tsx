import styles from "./QuizFilters.module.css";

function QuizFilters() {
    return (
        <div className={styles.filterContainer}>
            <select className={styles.select}>
                <option>Select Deck</option>
            </select>
            <select className={styles.select}>
                <option>Select Tag</option>
            </select>
            <input type="date" className={styles.dateInput} />
            <input type="date" className={styles.dateInput} />
        </div>
    );
}

export default QuizFilters;
