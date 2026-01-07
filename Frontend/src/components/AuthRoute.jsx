import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

const AuthRoute = ({ element, authType }) => {
    const { user, loading } = useContext(UserContext);

    if (loading) return <div className="text-center mt-20">Loading...</div>;

    // ---------- PROTECTED ROUTES ----------
    if (authType === "protected") {
        // not logged in
        if (!user) return <Navigate to="/" replace />;

        const isSetupComplete = Boolean(user.purpose) && Boolean(user.level);

        // user logged in but NOT finished onboarding
        if (!isSetupComplete) {
            if (!user.purpose) return <Navigate to="/purpose" replace />;

        }

        // setup complete -> allow normal access
        return <Navigate to="/main" replace />
    }

    // ---------- PUBLIC ROUTES ----------
    if (authType === "public") {
        // not logged in → can access
        if (!user) return element;

        // logged in
        const isSetupComplete = Boolean(user.purpose) && Boolean(user.level);

        return isSetupComplete
            ? <Navigate to="/main" replace />
            : <Navigate to="/purpose" replace />;
    }

    return element;
};

export default AuthRoute;