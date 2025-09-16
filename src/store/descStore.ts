import { create } from "zustand";
import { TagService } from "../services/tags.service";
import useAuth from "./authStore";
import { DeckI } from "../utils/types";

interface DescStoreI {
    descs: DeckI[];
    fetchDescs: () => Promise<void>;
}

const descStore = create<DescStoreI>((set) => ({
    descs: [],
    fetchDescs: async () => {
        const descs = await TagService.getTagsByUser(useAuth.getState().user?.id || "");
        set({ descs });
    },
}));

export default descStore;
