import {
    createContext,
    useState,
    useEffect,
    type ReactNode,
    type Dispatch,
    type SetStateAction,
} from "react";

interface User {
    purpose?: string;
    [key: string]: unknown;
}

interface UserContextType {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
    loading: boolean;
}

export const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/auth/me`,
                    {
                        credentials: "include",
                    }
                );

                if (!res.ok) {
                    setUser(null);
                } else {
                    const data: { user: User } = await res.json();
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
        <UserContext.Provider
            value={{
                user,
                setUser,
                loading,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};