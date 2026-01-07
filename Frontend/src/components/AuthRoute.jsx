import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

const AuthRoute = ({ element, authType }) => {
    console.log("calling /auth/me ...");
    const { user, loading } = useContext(UserContext);

    if (loading) return <div className="text-center mt-20">Loading...</div>;

    if (authType === "protected") {
        if (!user) return <Navigate to="/login" replace />;

        if (!user.purpose) return <Navigate to="/purpose" replace />;
        if (!user.level) return <Navigate to="/level" replace />;

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