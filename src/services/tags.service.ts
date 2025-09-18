// services/tag.service.ts
import { supabase } from "../lib/supabaseClient";
import { TagI } from "../utils/types";

export const TagService = {
    async getTagsByUser(userId: string): Promise<TagI[]> {
        const { data, error } = await supabase.from("tags").select("*").eq("user_id", userId);

        if (error) throw new Error(error.message);
        return data || [];
    },

    async createTag(name: string, userId: string): Promise<TagI> {
        const { data, error } = await supabase
            .from("tags")
            .insert({ name: name.trim(), user_id: userId })
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },
};
