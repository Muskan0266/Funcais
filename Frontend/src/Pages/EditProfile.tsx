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
            <nav className="h-20 md:h-40 w-full bg-[#43406e] flex items-center justify-center">
                <p className="text-2xl md:text-5xl font-light text-white">
                    Edit Profile
                </p>
            </nav>

            <div className="flex flex-col md:flex-row mx-auto w-full h-140 md:h-140 md:w-175 rounded-2xl shadow-lg shadow-black/50 bg-white bg-opacity-90 mt-10 justify-center gap-10">
                <div className="mx-auto md:mx-0 flex flex-col gap-6 w-60 md:w-100">
                    <div className="flex flex-col ml-0 md:ml-5 relative -mt-4 md:mt-10">
                        <p>First Name</p>
                        <input
                            name="FName"
                            value={form.FName}
                            onChange={handleForm}
                            className="border rounded p-2"
                            placeholder="First name"
                        />
                    </div>

                    <div className="flex flex-col ml-0 md:ml-5">
                        <p>Last Name</p>
                        <input
                            name="LName"
                            value={form.LName}
                            onChange={handleForm}
                            className="border rounded p-2"
                            placeholder="Last name"
                        />
                    </div>

                    <div className="flex flex-col ml-0 md:ml-5">
                        <p>Level</p>
                        <select
                            name="Level"
                            value={form.Level}
                            onChange={handleForm}
                            className="border rounded p-2"
                        >
                            <option value="">Select level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>

                    <div className="flex flex-col ml-0 md:ml-5">
                        <p>Joined Date</p>
                        <input
                            name="Date"
                            type="date"
                            value={form.Date}
                            onChange={handleForm}
                            className="border rounded p-2"
                        />
                    </div>

                    <div className="h-6 text-center mt-2">
                        {msg && <p className="text-green-600">{msg}</p>}
                    </div>

                    <button
                        onClick={edit}
                        disabled={isFormEmpty}
                        className={`mx-0 md:mx-auto h-10 w-60 md:w-70 mt-3 md:mt-10 rounded cursor-pointer
                            ${isFormEmpty
                                ? "bg-gray-400 text-gray-700"
                                : "bg-[#43406e] text-white hover:bg-[#353358]"
                            }`}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;