import { RouterProvider } from "react-router-dom";
import router from "./routing/routes";
import { Toaster } from "react-hot-toast";

const App = () => {
    return (
        <>
            <RouterProvider router={router} />
            <Toaster position="top-center" reverseOrder={false} />
        </>
    );
};

export default App;
