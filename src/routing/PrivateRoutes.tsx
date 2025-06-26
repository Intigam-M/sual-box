import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../store/authStore";

const PrivateRoutes = () => {
    const user = useAuth((state) => state.user);

    if (!user) return <Navigate to="/login" />;

    return <Outlet />;
};

export default PrivateRoutes;
