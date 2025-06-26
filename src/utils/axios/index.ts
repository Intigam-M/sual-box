import axios, { AxiosInstance } from "axios";
import useAuth from "../../store/authStore";

const baseURL = import.meta.env.VITE_BACKEND_API_URL;

const iaxios: AxiosInstance = axios.create({
    baseURL: baseURL,
});

iaxios.interceptors.request.use(
    (config) => {
        const token = useAuth.getState().user?.token;

        if (token) {
            config.headers["Authorization"] = `Token ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default iaxios;
