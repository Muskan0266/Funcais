import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
                    credentials: "include",
                });
                if (!res.ok) {
                    setUser(null);
                } else {
                    const data = await res.json();
                    setUser(data.user);
                }
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};