import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

const AuthRoute = ({ element, authType }) => {
    const { user, loading } = useContext(UserContext);

    if (loading) return <div className="text-center mt-20">Loading...</div>;

    // PUBLIC ROUTES: Landing, Login, Signup
    if (authType === "public") {
        if (!user) return element; // not logged in, show page

        // logged-in user → redirect based on setup
        if (!user.purpose) return <Navigate to="/purpose" replace />;
        if (!user.level) return <Navigate to="/level" replace />;
        return <Navigate to="/main" replace />;
    }

    // PROTECTED ROUTES: Main, Purpose, Level, etc.
    if (authType === "protected") {
        if (!user) return <Navigate to="/login" replace />; // not logged in

        // Redirect based on setup
        if (!user.purpose && window.location.pathname !== "/purpose")
            return <Navigate to="/purpose" replace />;
        if (user.purpose && !user.level && window.location.pathname !== "/level")
            return <Navigate to="/level" replace />;

        return element; // user has everything, show protected page
    }

    return element;
};

export default AuthRoute;