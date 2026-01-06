import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

const AuthRoute = ({ element, authType }) => {
    const { user, loading } = useContext(UserContext);

    if (loading) return <div>Loading...</div>; // spinner or blank

    if (authType === "protected") {
        return user ? element : <Navigate to="/" replace />;
    }

    if (authType === "public") {
        if (!user) return element;
        // check setupComplete
        return user.level && user.purpose ? (
            <Navigate to="/main" replace />
        ) : (
            <Navigate to="/" replace />
        );
    }

    return element;
};

export default AuthRoute;