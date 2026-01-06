import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

const AuthRoute = ({ element, authType }) => {
    const { user, loading } = useContext(UserContext);

    if (loading) return <div>Loading...</div>;

    // PROTECTED ROUTES
    if (authType === "protected") {
        if (!user) return <Navigate to="/" replace />; // not logged in → Landing
        return element; // logged in → allow access to protected page
    }

    // PUBLIC ROUTES
    if (authType === "public") {
        if (!user) return element; // not logged in → show login/signup
        return <Navigate to="/main" replace />; // logged in → redirect to Main
    }

    return element;
};

export default AuthRoute;