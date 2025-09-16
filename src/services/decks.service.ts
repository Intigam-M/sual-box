// services/deck.service.ts
import { supabase } from "../lib/supabaseClient";
import { DeckI } from "../utils/types";

export const DeckService = {
    async getDecksByUser(userId: string): Promise<DeckI[]> {
        const { data, error } = await supabase.from("decks").select("*").eq("user_id", userId);

        if (error) throw new Error(error.message);
        return data || [];
    },
};
