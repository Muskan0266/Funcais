import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";

const Purpose = () => {
    const [selected, setSelected] = useState(null);
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const options = ["Travel", "School", "Work", "Community", "Others"];

    const savePurpose = async () => {
        if (selected === null) return;

        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/purpose`,
            {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ purpose: options[selected] }),
            }
        );

        const data = await res.json();

        // update context
        setUser(prev => ({ ...prev, purpose: data.purpose }));

        navigate("/level");
    };

    return (
        <div>
            <h2>Why are you learning French?</h2>

            {options.map((p, i) => (
                <button
                    key={i}
                    onClick={() => setSelected(i)}
                    style={{ border: selected === i ? "2px solid black" : "" }}
                >
                    {p}
                </button>
            ))}

            <button disabled={selected === null} onClick={savePurpose}>
                Continue
            </button>
        </div>
    );
};

export default Purpose;