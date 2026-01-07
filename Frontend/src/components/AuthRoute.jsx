import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

const AuthRoute = ({ element, authType }) => {
    const { user, loading } = useContext(UserContext);
    const location = useLocation();

    if (loading) return <div className="text-center mt-20">Loading...</div>;

    const hasPurpose = Boolean(user?.purpose);
    const hasLevel = Boolean(user?.level);

    // -------- PUBLIC ROUTES --------
    // Landing, Login, Signup, etc.
    if (authType === "public") {
        if (!user) return element;           // show landing if logged out
        if (hasPurpose && hasLevel) return <Navigate to="/main" replace />;
        return <Navigate to="/purpose" replace />;
    }

    // -------- PROTECTED ROUTES --------
    if (authType === "protected") {
        if (!user) return <Navigate to="/" replace />; // NOT login — your landing page

        if (!hasPurpose && location.pathname !== "/purpose")
            return <Navigate to="/purpose" replace />;

        return element;
    }

    return element;
};

export default AuthRoute;