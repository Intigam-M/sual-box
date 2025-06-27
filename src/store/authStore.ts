import { create } from "zustand";
import { UserI } from "../utils/types";

interface AuthState {
    user: UserI | null;
    login: (user: UserI) => void;
    logout: () => void;
}

const useAuth = create<AuthState>((set) => ({
    user: JSON.parse(localStorage.getItem("authInfo") || "null"),

    login: (user) => {
        localStorage.setItem("authInfo", JSON.stringify(user));
        set({ user });
    },

    logout: () => {
        localStorage.removeItem("authInfo");
        set({ user: null });
    },
}));

export default useAuth;
