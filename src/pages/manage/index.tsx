import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { toast } from "react-hot-toast";
import useAuth from "../../store/authStore";
import styles from "./manage.module.css";
import Navbar from "../../components/navbar";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";

function ManagePage() {
    const { user } = useAuth();
    const [decks, setDecks] = useState<any[]>([]);
    const [tags, setTags] = useState<any[]>([]);

    const fetchData = async () => {
        if (!user?.id) return;
        const [deckRes, tagRes] = await Promise.all([
            supabase.from("decks").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
            supabase.from("tags").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        ]);
        if (deckRes.data) setDecks(deckRes.data);
        if (tagRes.data) setTags(tagRes.data);
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const deleteItem = async (type: "deck" | "tag", id: string) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: type === "deck" ? "Deleting this deck will also delete all its cards. Are you sure?" : "This tag will be deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "Cancel",
        });

        if (!confirm.isConfirmed) return;

        const { error } = await supabase
            .from(type === "deck" ? "decks" : "tags")
            .delete()
            .eq("id", id);

        if (error) {
            toast.error(`Failed to delete the ${type}`);
        } else {
            toast.success(`${type} deleted successfully`);
            type === "deck" ? setDecks((prev) => prev.filter((d) => d.id !== id)) : setTags((prev) => prev.filter((t) => t.id !== id));
        }
    };

    return (
        <div>
            <Navbar />
            <div className={styles.container}>
                {decks.length === 0 && tags.length === 0 ? (
                    <div className={styles.emptyMessage}>You don’t have any decks or tags yet.</div>
                ) : (
                    <>
                        <h2>Manage Decks</h2>
                        <ul>
                            {decks.map((deck) => (
                                <li key={deck.id}>
                                    {deck.name}
                                    <button className={styles.deleteBtn} onClick={() => deleteItem("deck", deck.id)}>
                                        <MdDelete />
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <h2>Manage Tags</h2>

                        <ul>
                            {tags.map((tag) => (
                                <li key={tag.id}>
                                    {tag.name}
                                    <button className={styles.deleteBtn} onClick={() => deleteItem("tag", tag.id)}>
                                        <MdDelete />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}

export default ManagePage;
