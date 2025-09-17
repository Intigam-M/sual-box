import { create } from "zustand";
import { DeckService } from "../services/decks.service";
import useAuth from "./authStore";
import { DeckI } from "../utils/types";

interface DeckStoreI {
    descs: DeckI[];
    fetchDescs: () => Promise<void>;
}

const useDeckStore = create<DeckStoreI>((set) => ({
    descs: [],
    fetchDescs: async () => {
        const descs = await DeckService.getDecksByUser(useAuth.getState().user?.id || "");
        set({ descs });
    },
}));

export default useDeckStore;
