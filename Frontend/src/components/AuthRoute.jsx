// components/IsAuthN.jsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const AuthRoute = ({ element, authType }) => {
    const [isReady, setIsReady] = useState(false);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        try {
            // Avoid SSR issues and crashes
            const token = typeof window !== "undefined"
                ? localStorage.getItem("token")
                : null;

            setIsAuth(!!token);
        } catch {
            setIsAuth(false);
        }

        setIsReady(true);
    }, []);

    // Prevent flashing wrong screen while checking token
    if (!isReady) return null;

    if (authType === "protected") {
        return isAuth ? element : <Navigate to="/login" replace />;
    }

    if (authType === "public") {
        return isAuth ? <Navigate to="/main" replace /> : element;
    }

    return element;
};

export default AuthRoute;