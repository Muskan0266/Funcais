import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

const AuthRoute = ({ element, authType }) => {
    const { user, loading } = useContext(UserContext);
    const location = useLocation();

    if (loading) return <div className="text-center mt-20">Loading...</div>;

    const hasPurpose = Boolean(user?.purpose);
    const hasLevel = Boolean(user?.level);

    // -------- PROTECTED ROUTES --------
    if (authType === "protected") {
        if (!user) return <Navigate to="/login" replace />;

        // Only gatekeep on purpose — Level is handled inside Purpose screen
        if (!hasPurpose && location.pathname !== "/purpose") {
            return <Navigate to="/purpose" replace />;
        }

        return element;
    }

    // -------- PUBLIC ROUTES --------
    if (authType === "public") {
        if (!user) return element;

        // If they completed setup → go straight to main
        if (hasPurpose && hasLevel) return <Navigate to="/main" replace />;

        // Otherwise go to purpose flow
        return <Navigate to="/purpose" replace />;
    }

    return element;
};

export default AuthRoute;