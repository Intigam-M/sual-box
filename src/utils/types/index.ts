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
