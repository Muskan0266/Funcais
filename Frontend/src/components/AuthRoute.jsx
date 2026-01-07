import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

const AuthRoute = ({ element, authType }) => {
    const { user, loading } = useContext(UserContext);

    if (loading) return <div className="text-center mt-20">Loading...</div>;

    if (authType === "public") {
        return !user ? element : <Navigate to="/main" replace />;
    }

    if (authType === "protected") {
        return user ? element : <Navigate to="/" replace />;
    }

    return element;
};

export default AuthRoute;