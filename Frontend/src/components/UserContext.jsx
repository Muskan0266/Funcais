import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [setupComplete, setSetupComplete] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                    setSetupComplete(data.setupComplete);
                } else {
                    setUser(null);
                    setSetupComplete(false);
                }
            } catch (err) {
                setUser(null);
                setSetupComplete(false);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading, setupComplete }}>
            {children}
        </UserContext.Provider>
    );
};