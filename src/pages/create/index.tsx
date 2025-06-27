import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../lib/supabaseClient";
import useAuth from "../../store/authStore";
import styles from "./createCard.module.css";
import Navbar from "../../components/navbar";

const schema = z.object({
    deck: z.string().min(1, "Deck seçilməlidir"),
    tags: z.array(z.string()).optional(),
    question: z.string().min(1, "Sual boş ola bilməz"),
    answer: z.string().min(1, "Cavab boş ola bilməz"),
});

type FormData = z.infer<typeof schema>;

function CreateCardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [decks, setDecks] = useState<any[]>([]);
    const [tags, setTags] = useState<any[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    useEffect(() => {
        const fetchData = async () => {
            const [deckRes, tagRes] = await Promise.all([supabase.from("decks").select("*").eq("user_id", user?.id), supabase.from("tags").select("*").eq("user_id", user?.id)]);
            if (deckRes.data) setDecks(deckRes.data);
            if (tagRes.data) setTags(tagRes.data);
        };
        if (user?.id) fetchData();
    }, [user]);

    const handleCreateTag = async () => {
        const { value: tagName } = await Swal.fire({
            title: "Create New Tag",
            input: "text",
            inputLabel: "Tag Name",
            inputPlaceholder: "Enter tag name",
            showCancelButton: true,
            confirmButtonText: "OK",
        });

        if (!tagName || !user?.id) return;

        const { data, error } = await supabase.from("tags").insert({ name: tagName.trim(), user_id: user.id }).select().single();

        if (error) {
            Swal.fire("Error", "Tag yaratmaq mümkün olmadı", "error");
        } else {
            setTags((prev) => [...prev, data]);
            Swal.fire("Uğurlu", "Tag yaradıldı", "success");
        }
    };

    const handleCreateDeck = async () => {
        const { value: deckName } = await Swal.fire({
            title: "Create New Deck",
            input: "text",
            inputLabel: "Deck Name",
            inputPlaceholder: "Enter deck name",
            showCancelButton: true,
            confirmButtonText: "OK",
        });

        if (!deckName || !user?.id) return;

        const { data, error } = await supabase.from("decks").insert({ name: deckName.trim(), user_id: user.id }).select().single();

        if (error) {
            Swal.fire("Error", "Deck yaratmaq mümkün olmadı", "error");
        } else {
            setDecks((prev) => [...prev, data]);
            Swal.fire("Uğurlu", "Deck yaradıldı", "success");
        }
    };

    const onSubmit = async (data: FormData) => {
        const { deck, question, answer } = data;

        const { data: cardData, error: cardError } = await supabase.from("cards").insert({ user_id: user?.id, deck_id: deck, question, answer }).select().single();

        if (cardError || !cardData) {
            Swal.fire("Xəta", "Kart əlavə edilərkən xəta baş verdi", "error");
            return;
        }

        // tag-larla əlaqəni saxla
        for (let tag_id of selectedTags) {
            await supabase.from("card_tags").insert({
                card_id: cardData.id,
                tag_id,
            });
        }

        Swal.fire("Uğurlu", "Kart əlavə olundu!", "success");
        navigate("/review");
    };

    return (
        <div>
            {" "}
            <Navbar />
            <div className={styles.container}>
                <h2 className={styles.heading}>Create New Card</h2>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    {/* Deck */}
                    <div className={styles.row}>
                        <label>Deck</label>
                        <select {...register("deck")} className={styles.input}>
                            <option value="">Select Deck</option>
                            {decks.map((deck) => (
                                <option key={deck.id} value={deck.id}>
                                    {deck.name}
                                </option>
                            ))}
                        </select>
                        <button type="button" className={styles.inlineBtn} onClick={handleCreateDeck}>
                            Create Deck
                        </button>
                    </div>

                    {/* Tag */}
                    <div className={styles.row}>
                        <label>Tags</label>
                        <select multiple className={styles.input} value={selectedTags} onChange={(e) => setSelectedTags(Array.from(e.target.selectedOptions, (o) => o.value))}>
                            {tags.map((tag) => (
                                <option key={tag.id} value={tag.id}>
                                    {tag.name}
                                </option>
                            ))}
                        </select>
                        <button type="button" className={styles.inlineBtn} onClick={handleCreateTag}>
                            Create Tag
                        </button>
                    </div>

                    {/* Question */}
                    <div className={styles.row}>
                        <label>Question</label>
                        <textarea {...register("question")} className={styles.input}></textarea>
                        {errors.question && <span className={styles.error}>{errors.question.message}</span>}
                    </div>

                    {/* Answer */}
                    <div className={styles.row}>
                        <label>Answer</label>
                        <textarea {...register("answer")} className={styles.input}></textarea>
                        {errors.answer && <span className={styles.error}>{errors.answer.message}</span>}
                    </div>

                    {/* Buttons */}
                    <div className={styles.actions}>
                        <button type="submit" className={styles.createBtn}>
                            Create Card
                        </button>
                        <button type="button" className={styles.cancelBtn} onClick={() => navigate("/")}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateCardPage;
