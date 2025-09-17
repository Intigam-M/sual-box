import { create } from "zustand";

interface FiltersStoreI {
    selectedDeck: string | null;
    selectedTag: string | null;
    startDate: string | null;
    endDate: string | null;
    setFilters: (filters: Partial<FiltersStoreI>) => void;
}

const useFiltersStore = create<FiltersStoreI>((set) => ({
    selectedDeck: null,
    selectedTag: null,
    startDate: null,
    endDate: null,
    setFilters: (filters) =>
        set((state) => ({
            ...state,
            ...filters,
        })),
}));

export default useFiltersStore;
