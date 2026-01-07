import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

const AuthRoute = ({ element, authType }) => {
    const { user, loading } = useContext(UserContext);

    if (loading) return <div className="text-center mt-20">Loading...</div>;

    // -------- PUBLIC ROUTES (landing, login, signup, etc.) --------
    if (authType === "public") {
        // If logged out → show normally
        if (!user) return element;

        // If logged in → always go to main
        return <Navigate to="/main" replace />;
    }

    // -------- PROTECTED ROUTES (main, profile, etc.) --------
    if (authType === "protected") {
        // If not logged in → go to landing
        if (!user) return <Navigate to="/" replace />;

        // If logged in → allow page
        return element;
    }

    return element;
};

export default AuthRoute;