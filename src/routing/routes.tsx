import { createBrowserRouter } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";
import HomePage from "../pages/home";

const router = createBrowserRouter([
    {
        path: "/",
        errorElement: <LoginPage />,
        children: [
            { path: "/login", element: <LoginPage /> },
            { path: "/register", element: <RegisterPage /> },
        ],
    },
    {
        element: <PrivateRoutes />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "*", element: <HomePage /> },
        ],
    },
]);

export default router;
