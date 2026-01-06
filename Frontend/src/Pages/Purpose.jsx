import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";

const Purpose = () => {
    const { user, setUser } = useContext(UserContext);
    const [purpose, setPurpose] = useState(user?.purpose || "");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/purpose`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ purpose })
            });
            const data = await res.json();
            if (res.ok) {
                setUser({ ...user, purpose });
                navigate("/level");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-10 text-center">
            <h1 className="text-3xl font-bold">Choose Your Purpose</h1>
            <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="border p-3 mt-4"
            />
            <button onClick={handleSubmit} className="bg-blue-700 text-white py-2 px-6 rounded mt-4">Save & Continue</button>
        </div>
    );
};

export default Purpose;