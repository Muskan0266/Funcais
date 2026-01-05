// components/IsAuthN.jsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const AuthRoute = ({ element, authType }) => {
    const [isReady, setIsReady] = useState(false);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/auth/me`,
                    {
                        method: "GET",
                        credentials: "include"   // <-- send cookie
                    }
                );

                setIsAuth(res.ok);
            } catch {
                setIsAuth(false);
            }

            setIsReady(true);
        };

        checkAuth();
    }, []);

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