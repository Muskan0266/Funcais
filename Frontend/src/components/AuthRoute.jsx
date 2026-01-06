import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

const AuthRoute = ({ element, authType }) => {
    const { user, loading } = useContext(UserContext);

    if (loading) return <div>Loading...</div>; // spinner or blank

    // PROTECTED ROUTES: user must be logged in
    if (authType === "protected") {
        return user ? element : <Navigate to="/" replace />; // not logged in → Landing
    }

    // PUBLIC ROUTES: user must NOT be logged in
    if (authType === "public") {
        return user ? <Navigate to="/main" replace /> : element;
    }

    return element;
};

export default AuthRoute;