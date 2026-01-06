import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

const AuthRoute = ({ element, authType }) => {
    const { user, loading } = useContext(UserContext);

    if (loading) return null; // or a spinner

    if (authType === "protected") {
        return user ? element : <Navigate to="/login" replace />;
    }

    if (authType === "public") {
        return user ? <Navigate to="/purpose" replace /> : element;
    }

    return element;
};

export default AuthRoute;