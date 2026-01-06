import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

const AuthRoute = ({ element, authType }) => {
    const { user, loading, setupComplete } = useContext(UserContext);

    if (loading) return <div>Loading...</div>; // spinner or blank

    // PROTECTED ROUTES: user must be logged in
    if (authType === "protected") {
        if (!user) return <Navigate to="/" replace />; // not logged in → Landing
        if (!setupComplete) return <Navigate to="/purpose" replace />; // logged in but setup incomplete
        return element; // fully set up
    }

    // PUBLIC ROUTES: user must NOT be logged in
    if (authType === "public") {
        if (!user) return element; // not logged in → show login/signup
        // logged in → redirect based on setupComplete
        return setupComplete ? <Navigate to="/main" replace /> : <Navigate to="/" replace />;
    }

    return element;
};

export default AuthRoute;