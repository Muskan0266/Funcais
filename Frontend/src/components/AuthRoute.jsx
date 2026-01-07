import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

const AuthRoute = ({ element, authType }) => {
    console.log("calling /auth/me ...");
    console.log("URL =", `${import.meta.env.VITE_API_URL}/auth/me`);
    const { user, loading } = useContext(UserContext);

    if (loading) return <div className="text-center mt-20">Loading...</div>;

    if (authType === "protected") {
        if (!user) return <Navigate to="/login" replace />;

        const isSetupComplete = Boolean(user.purpose) && Boolean(user.level);

        // If setup not complete, guide them through flow
        if (!isSetupComplete) {
            if (!user.purpose && window.location.pathname !== "/purpose")
                return <Navigate to="/purpose" replace />;

            if (user.purpose && !user.level && window.location.pathname !== "/level")
                return <Navigate to="/level" replace />;
        }

        return element;
    }

    if (authType === "public") {
        if (!user) return element;

        return user.purpose && user.level
            ? <Navigate to="/main" replace />
            : <Navigate to="/purpose" replace />;
    }

    return element;
};

export default AuthRoute;