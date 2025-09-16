// services/tag.service.ts
import { supabase } from "../lib/supabaseClient";
import { TagI } from "../utils/types";

export const TagService = {
    async getTagsByUser(userId: string): Promise<TagI[]> {
        const { data, error } = await supabase.from("tags").select("*").eq("user_id", userId);

        if (error) throw new Error(error.message);
        return data || [];
    },
};
