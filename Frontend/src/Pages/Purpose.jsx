import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";

const Purpose = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const [selectedIndex, setSelectedIndex] = useState(null);
    const [loading, setLoading] = useState(false);

    const API = import.meta.env.VITE_API_URL;

    const arr = [
        { id: 0, value: "Travel", icon: "travel", color: "#F08787" },
        { id: 1, value: "School", icon: "auto_stories", color: "#696FC7" },
        { id: 2, value: "Work", icon: "handshake", color: "#A8BBA3" },
        { id: 3, value: "Community", icon: "diversity_1", color: "#FAEAB1" },
        { id: 4, value: "Others", icon: "pending", color: "#6B3F69" }
    ];

    async function handleContinue() {
        if (selectedIndex === null) return;

        setLoading(true);

        try {
            const purpose = arr[selectedIndex].value;

            // Save purpose to backend
            const res = await fetch(`${API}/updatePurpose`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ purpose })
            });

            const data = await res.json();

            if (data.user) {
                // update user context
                setUser(data.user);

                // go to next step
                navigate("/level");
            }
        } catch (err) {
            console.error(err);
        }

        setLoading(false);
    }

    return (
        <div>
            <p className="font-bold text-xl text-center mt-6">
                Hello! Why are you learning French?
            </p>

            <div className="grid p-6 gap-4">
                {arr.map((card, index) => (
                    <div
                        key={card.id}
                        onClick={() => setSelectedIndex(index)}
                        className={`p-6 rounded-2xl cursor-pointer border-2
                        ${selectedIndex === index ? "border-black" : "border-transparent"}`}
                        style={{ backgroundColor: card.color }}
                    >
                        {card.value}
                    </div>
                ))}
            </div>

            <button
                disabled={selectedIndex === null || loading}
                onClick={handleContinue}
                className={`block mx-auto mt-6 px-6 py-3 rounded text-white 
                    ${selectedIndex !== null ? "bg-blue-700" : "bg-gray-400"}`}
            >
                {loading ? "Saving..." : "Continue"}
            </button>
        </div>
    );
};

export default Purpose;