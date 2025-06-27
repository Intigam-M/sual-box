import { createBrowserRouter } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";
import QuizPage from "../pages/quiz";
import CreateCardPage from "../pages/create";
import ReviewPage from "../pages/review";
import ManagePage from "../pages/manage";
import PublicRoute from "./PublicRoute";
import { Navigate } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <PublicRoute />,
        errorElement: <LoginPage />,
        children: [
            { path: "/login", element: <LoginPage /> },
            { path: "/register", element: <RegisterPage /> },
        ],
    },
    {
        element: <PrivateRoutes />,
        children: [
            { index: true, element: <QuizPage /> },
            { path: "/create", element: <CreateCardPage /> },
            { path: "/review", element: <ReviewPage /> },
            { path: "/manage", element: <ManagePage /> },
            { path: "*", element: <Navigate to="/" replace /> },
        ],
    },
]);

export default router;
