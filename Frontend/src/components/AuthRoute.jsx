import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

const AuthRoute = ({ element, authType }) => {
    const { user, loading, setupComplete } = useContext(UserContext);

    if (loading) return <p className="text-center mt-10">Loading...</p>;

    if (authType === "protected") {
        // if user exists but setup not complete, redirect to /purpose
        if (!user) return <Navigate to="/" replace />;
        if (user && !setupComplete) return <Navigate to="/purpose" replace />;
        return element; // logged in & setup complete
    }

    if (authType === "public") {
        return user
            ? setupComplete
                ? <Navigate to="/main" replace />   // full user, setup done
                : <Navigate to="/purpose" replace /> // logged in, setup pending
            : element; // not logged in, show public page
    }

    return element;
};

export default AuthRoute;