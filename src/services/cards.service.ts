import { CardI, FilterDataI } from "../utils/types";
import { supabase } from "../lib/supabaseClient";
import { shuffleArray } from "../utils/helpers/shuffleArray";

export const fetchFilteredCards = async (userId: string, filterData: FilterDataI) => {
    let query = supabase.from("cards").select("*, card_tags(tag_id)").eq("user_id", userId);

    if (filterData.selectedDeck) query = query.eq("deck_id", filterData.selectedDeck);
    if (filterData.startDate) query = query.gte("created_at", filterData.startDate);
    if (filterData.endDate) query = query.lte("created_at", filterData.endDate);

    const { data, error } = await query;

    if (error) throw error;

    if (filterData.selectedTag) {
        return data.filter((card: any) => card.card_tags?.some((ct: any) => ct.tag_id === filterData.selectedTag));
    }

    return data;
};

export async function fetchExtraCardsFromSupabase(
    deckId: string,
    exclude: Set<string>,
    userId: string
): Promise<CardI[]> {
    const { data, error } = await supabase.from("cards").select("*").eq("deck_id", deckId).eq("user_id", userId);

    if (error || !data) return [];

    const filtered = data.filter((card) => !exclude.has(card.id));
    return shuffleArray(filtered).slice(0, 5);
}
