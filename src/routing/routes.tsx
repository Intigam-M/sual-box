import { createBrowserRouter } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";
import QuizPage from "../pages/quiz";

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
            { index: true, element: <QuizPage /> },
            { path: "*", element: <QuizPage /> },
        ],
    },
]);

export default router;
