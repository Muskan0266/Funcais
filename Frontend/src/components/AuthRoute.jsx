import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

const AuthRoute = ({ element, authType }) => {
    const { user, loading } = useContext(UserContext);

    if (loading) return <div>Loading...</div>;

    // 🔒 PROTECTED ROUTES
    if (authType === "protected") {
        if (!user) return <Navigate to="/" replace />;

        // 🚧 if not finished setup → force to purpose/level
        if (!user.purpose) return <Navigate to="/purpose" replace />;
        if (!user.level) return <Navigate to="/level" replace />;

        return element;
    }

    // 🌎 PUBLIC ROUTES
    if (authType === "public") {
        if (!user) return element; // not logged in → show page (landing/login/signup)

        // logged in → go straight to main
        return <Navigate to="/main" replace />;
    }

    return element;
};

export default AuthRoute;