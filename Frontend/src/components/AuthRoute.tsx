import { Navigate } from "react-router-dom";
import { useContext } from "react";
import type { ReactElement } from "react";
import { UserContext } from "./UserContext";

interface AuthRouteProps {
    element: ReactElement;
    authType: "public" | "protected";
    requirePurpose?: boolean;
}

const AuthRoute = ({
    element,
    authType,
    requirePurpose = false,
}: AuthRouteProps) => {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("UserContext must be used within UserProvider");
    }

    const { user, loading } = context;

    if (loading) {
        return <div className="text-center mt-20">Loading...</div>;
    }

    if (authType === "public") {
        return !user ? element : <Navigate to="/main" replace />;
    }

    if (authType === "protected") {
        if (!user) {
            return <Navigate to="/" replace />;
        }

        if (requirePurpose && !user.purpose) {
            return <Navigate to="/purpose" replace />;
        }

        return element;
    }

    return element;
};

export default AuthRoute;