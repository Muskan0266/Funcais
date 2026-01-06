import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

const AuthRoute = ({ element, authType }) => {
    const { user, loading } = useContext(UserContext);

    if (loading) return <div>Loading...</div>;

    const setupComplete = user?.purpose && user?.level;

    // PROTECTED ROUTES
    if (authType === "protected") {
        if (!user) return <Navigate to="/" replace />;

        // logged in BUT setup not done → force to purpose page
        if (!setupComplete) return <Navigate to="/purpose" replace />;

        return element;
    }

    // PUBLIC ROUTES
    if (authType === "public") {
        if (!user) return element;

        // Logged in:
        return setupComplete
            ? <Navigate to="/main" replace />
            : <Navigate to="/purpose" replace />;
    }

    return element;
};

export default AuthRoute;