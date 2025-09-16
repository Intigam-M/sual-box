export interface UserI {
    id: string;
    email: string | null;
    token: string;
}

export interface CardI {
    id: string;
    deck_id: string;
    question: string;
    answer: string;
    created_at: string;
}

export interface DeckI {
    id: string;
    name: string;
    user_id: string;
    created_at: string;
}

export interface TagI {
    id: string;
    name: string;
    user_id: string;
    created_at: string;
}
