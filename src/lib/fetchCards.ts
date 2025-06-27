import { supabase } from "./supabaseClient";

export const fetchFilteredCards = async (userId: string, deckId: string, tagId: string, startDate: string | null, endDate: string | null) => {
    let query = supabase.from("cards").select("*, card_tags(tag_id)").eq("user_id", userId);

    if (deckId) query = query.eq("deck_id", deckId);
    if (startDate) query = query.gte("created_at", startDate);
    if (endDate) query = query.lte("created_at", endDate);

    const { data, error } = await query;

    if (error) throw error;

    if (tagId) {
        return data.filter((card: any) => card.card_tags?.some((ct: any) => ct.tag_id === tagId));
    }

    return data;
};
