import { useState, useEffect, useContext, type ChangeEvent, } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";

interface User {
    FName?: string;
    LName?: string;
    level?: string;
    date?: string;
    [key: string]: unknown;
}

interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    loading: boolean;
}

interface FormData {
    FName: string;
    LName: string;
    Level: string;
    Date: string;
}

const EditProfile = () => {
    const navigate = useNavigate();

    const { user, setUser } = useContext(
        UserContext
    ) as UserContextType;

    const [msg, setMsg] = useState<string>("");

    const [form, setForm] = useState<FormData>({
        FName: "",
        LName: "",
        Level: "",
        Date: "",
    });

    const API = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (user) {
            setForm({
                FName: user.FName?.toString() || "",
                LName: user.LName?.toString() || "",
                Level: user.level?.toString() || "",
                Date: user.date
                    ? user.date.split("T")[0]
                    : "",
            });
        }
    }, [user]);

    const isFormEmpty =
        !form.FName &&
        !form.LName &&
        !form.Level &&
        !form.Date;

    const handleForm = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const edit = async (): Promise<void> => {
        try {
            const updatedData: Record<string, string> = {};

            const mapping: Record<
                keyof FormData,
                string
            > = {
                FName: "FName",
                LName: "LName",
                Level: "level",
                Date: "date",
            };

            (Object.keys(form) as (keyof FormData)[]).forEach(
                (key) => {
                    if (
                        form[key] !== "" &&
                        form[key] !==
                        String(
                            user?.[
                            mapping[key] as keyof User
                            ] ?? ""
                        )
                    ) {
                        updatedData[mapping[key]] =
                            form[key];
                    }
                }
            );

            if (Object.keys(updatedData).length === 0) {
                setMsg("No changes to update.");
                return;
            }

            const res = await fetch(
                `${API}/editProfile`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(updatedData),
                }
            );

            const data: { user?: User } =
                await res.json();

            if (data.user) {
                setUser(data.user);

                setMsg(
                    "Profile updated successfully!"
                );

                setTimeout(() => {
                    navigate("/profile");
                }, 1000);
            }
        } catch (err) {
            console.error(err);
            setMsg(
                "Server error while updating profile"
            );
        }
    };

    return (
        <div>
            {/* Keep your existing JSX unchanged */}
        </div>
    );
};

export default EditProfile;