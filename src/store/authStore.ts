import { create } from "zustand";
import axios from "../utils/axios";
import { UserI } from "../utils/types";

interface AuthState {
    user: UserI | null;
    login: (user: UserI) => void;
    logout: () => void;
}

const useAuth = create<AuthState>((set) => ({
    user: JSON.parse(localStorage.getItem("authInfo") || "null"),

    login: (user) =>
        set(() => {
            localStorage.setItem("authInfo", JSON.stringify(user));
            return { user };
        }),

    logout: () =>
        set((state) => {
            localStorage.removeItem("authInfo");
            if (state.user) {
                axios.post("logout/", { email: state.user.email }, { headers: { Authorization: `Token ${state.user.token}` } });
            }
            return { user: null };
        }),
}));

export default useAuth;
