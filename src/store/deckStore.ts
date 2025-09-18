import { create } from "zustand";
import { DeckService } from "../services/decks.service";
import useAuth from "./authStore";
import { DeckI } from "../utils/types";
import { toast } from "react-hot-toast";

interface DeckStoreI {
    descs: DeckI[];
    fetchDecks: () => Promise<void>;
    setDeck: (decks: string) => void;
}

const useDeckStore = create<DeckStoreI>((set) => ({
    descs: [],
    fetchDecks: async () => {
        const descs = await DeckService.getDecksByUser(useAuth.getState().user?.id || "");
        set({ descs });
    },

    setDeck: async (deckName) => {
        const descs = await DeckService.createDeck(deckName, useAuth.getState().user?.id || "");
        set((state) => ({ descs: [...state.descs, descs] }));
        toast.success("Deck created successfully");
    },
}));

export default useDeckStore;
