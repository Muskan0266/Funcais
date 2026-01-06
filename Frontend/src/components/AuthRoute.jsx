import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

const AuthRoute = ({ element, authType }) => {
    const { user, loading } = useContext(UserContext);

    if (loading) return <div>Loading...</div>; // spinner

    // PROTECTED ROUTES
    if (authType === "protected") {
        if (!user) return <Navigate to="/" replace />;
        return element;
    }

    // PUBLIC ROUTES
    if (authType === "public") {
        if (!user) return element;
        return user.level && user.purpose ? <Navigate to="/main" replace /> : <Navigate to="/purpose" replace />;
    }

    return element;
};

export default AuthRoute;