import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

const AuthRoute = ({ element, authType }) => {
    const { user, loading } = useContext(UserContext);

    if (loading) return <div className="text-center mt-20">Loading...</div>;

    // PUBLIC ROUTES: Landing, Login, Signup
    if (authType === "public") {
        return !user ? element : <Navigate to="/main" replace />;
    }

    // PROTECTED ROUTES: Main, Purpose, Level, etc.
    if (authType === "protected") {
        if (!user) return <Navigate to="/" replace />;

        // Redirect based on setup
        if (!user.purpose && window.location.pathname !== "/purpose")
            return <Navigate to="/purpose" replace />;

        // if (user.purpose && !user.level && window.location.pathname !== "/level")
        //     return <Navigate to="/level" replace />;

        return element;
    }

    return element;
};

export default AuthRoute;