import { create } from "zustand";
import { TagService } from "../services/tags.service";
import useAuth from "./authStore";
import { TagI } from "../utils/types";
import { toast } from "react-hot-toast";
interface TagStoreI {
    tags: TagI[];
    fetchTags: () => Promise<void>;
    setTag: (tagName: string) => Promise<void>;
}

const useTagStore = create<TagStoreI>((set) => ({
    tags: [],
    fetchTags: async () => {
        const tags = await TagService.getTagsByUser(useAuth.getState().user?.id || "");
        set({ tags });
    },
    setTag: async (tagName) => {
        const tags = await TagService.createTag(tagName, useAuth.getState().user?.id || "");
        set((state) => ({ tags: [...state.tags, tags] }));
        toast.success("Tag created successfully");
    },
}));

export default useTagStore;
