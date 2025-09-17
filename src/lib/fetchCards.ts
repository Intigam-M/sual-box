import { FilterDataI } from "../utils/types";
import { supabase } from "./supabaseClient";

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
