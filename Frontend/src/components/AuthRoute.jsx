import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

const AuthRoute = ({ element, authType }) => {
    const { user, loading } = useContext(UserContext);

    if (loading) return <div className="text-center mt-20">Loading...</div>;

    // PUBLIC ROUTES: Landing, Login, Signup
    if (authType === "public") {
        if (!user) return element;

        // user has NOT finished setup → go to purpose
        if (!user.purpose) return <Navigate to="/purpose" replace />;

        // user finished purpose but not level → go to level


        // user fully set up → go to main page
        return <Navigate to="/main" replace />;
    }

    // PROTECTED ROUTES: Main, Purpose, Level, etc.
    if (authType === "protected") {
        if (!user) return <Navigate to="/" replace />; // not logged in

        // Redirect based on setup
        if (!user.purpose) return <Navigate to="/purpose" replace />;


        return element; // user has everything, show protected page
    }

    return element;
};

export default AuthRoute;