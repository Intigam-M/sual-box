import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../store/authStore";

const PublicRoute = () => {
    const user = useAuth((state) => state.user);
    if (user) return <Navigate to="/" />;
    return <Outlet />;
};

export default PublicRoute;
