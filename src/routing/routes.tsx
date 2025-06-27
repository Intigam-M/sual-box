import { createBrowserRouter } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";
import QuizPage from "../pages/quiz";
import CreateCardPage from "../pages/create";
import ReviewPage from "../pages/review";

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
            { path: "/create", element: <CreateCardPage /> },
            { path: "/review", element: <ReviewPage /> },
        ],
    },
]);

export default router;
