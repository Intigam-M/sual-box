import { create } from "zustand";

interface FiltersStoreI {
    selectedDeck: string;
    selectedTag: string;
    startDate: string | null;
    endDate: string | null;
    setFilters: (deck: string, tag: string, start: string | null, end: string | null) => void;
}

const filtersStore = create<FiltersStoreI>((set) => ({
    selectedDeck: "",
    selectedTag: "",
    startDate: null,
    endDate: null,
    setFilters: (deck, tag, start, end) =>
        set({
            selectedDeck: deck,
            selectedTag: tag,
            startDate: start,
            endDate: end,
        }),
}));

export default filtersStore;
