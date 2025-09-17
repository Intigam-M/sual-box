import { create } from "zustand";
import { TagService } from "../services/tags.service";
import useAuth from "./authStore";
import { TagI } from "../utils/types";

interface TagStoreI {
    tags: TagI[];
    fetchTags: () => Promise<void>;
}

const useTagStore = create<TagStoreI>((set) => ({
    tags: [],
    fetchTags: async () => {
        const tags = await TagService.getTagsByUser(useAuth.getState().user?.id || "");
        set({ tags });
    },
}));

export default useTagStore;
