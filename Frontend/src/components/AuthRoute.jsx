import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

const AuthRoute = ({ element, authType, requirePurpose = false }) => {
    const { user, loading } = useContext(UserContext);

    if (loading) return <div className="text-center mt-20">Loading...</div>;

    // ---------- PUBLIC ----------
    if (authType === "public") {
        return !user ? element : <Navigate to="/main" replace />;
    }

    // ---------- PROTECTED ----------
    if (authType === "protected") {
        if (!user) return <Navigate to="/" replace />;

        // only redirect to purpose IF this route requires it
        if (requirePurpose && !user.purpose) {
            return <Navigate to="/purpose" replace />;
        }

        return element;
    }

    return element;
};

export default AuthRoute;