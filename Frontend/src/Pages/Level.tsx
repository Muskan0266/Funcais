import { useState } from "react";
import { Link } from "react-router-dom";

interface LevelCard {
    id: number;
    icon: string;
    level: string;
    color: string;
    text: string;
    margin: string;
}

interface LevelResponse {
    message?: string;
}

const Purpose = () => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [err, setErr] = useState<string>("");

    const API = import.meta.env.VITE_API_URL;

    const arr: LevelCard[] = [
        {
            id: 0,
            icon: "lightbulb_2",
            level: "Beginner",
            color: "#ffc29a",
            text: "text-2xl md:text-4xl",
            margin: "ml-25 md:ml-50",
        },
        {
            id: 1,
            icon: "mic",
            level: "Intermediate",
            color: "#ff964f",
            text: "text-2xl md:text-4xl",
            margin: "ml-25 md:ml-50",
        },
        {
            id: 2,
            icon: "language",
            level: "Advanced",
            color: "#FF2C2C",
            text: "text-2xl md:text-4xl",
            margin: "ml-25 md:ml-50",
        },
    ];

    const handleClick = (index: number): void => {
        setSelectedIndex(index);
    };

    const selectLevel = async (level: string): Promise<void> => {
        try {
            const api = await fetch(`${API}/level`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ level }),
            });

            const data: LevelResponse = await api.json();

            if (!api.ok) {
                setErr(data.message || "Something went wrong");
                return;
            }

            setErr("");
            console.log(data);
        } catch (e) {
            console.error(e);
            setErr("Server error — please try again");
        }
    };

    return (
        <div className="h-50 md:h-100">
            <p className="font-bold text-2xl md:text-3xl text-black ml-12 md:ml-120 pt-10 md:pt-7">
                Find Your Level
            </p>

            <div className="grid grid-cols-1 grid-rows-1 md:block gap-4 p-4 mt-10 md:mt-5 justify-items-center">
                {arr.map((card, index) => {
                    const isSelected = selectedIndex === index;

                    return (
                        <div
                            key={card.id}
                            onClick={() => {
                                handleClick(index);
                                void selectLevel(card.level);
                            }}
                            className={`mt-5 relative block md:flex items-start h-15 w-70 md:h-35 md:w-130 rounded-2xl cursor-pointer
                                ${isSelected
                                    ? "border-2 border-black"
                                    : "border-2 border-transparent"
                                }
                                hover:border-2 hover:border-black`}
                            style={{
                                backgroundColor: card.color,
                            }}
                        >
                            <div>
                                <span className="material-symbols-outlined scale-[2] md:scale-[4] ml-10 md:ml-20 mt-4 md:mt-18 relative">
                                    {card.icon}
                                </span>

                                <p
                                    className={`${card.text} ${card.margin} font-serif relative -top-9 md:-top-15`}
                                >
                                    {card.level}
                                </p>
                            </div>

                            {isSelected && (
                                <span className="material-symbols-outlined text-black absolute right-2 top-2 scale-[2]">
                                    check
                                </span>
                            )}

                            <p className="text-red-600 text-sm text-center pt-5">
                                {err}
                            </p>
                        </div>
                    );
                })}
            </div>

            <footer className="mt-45 md:mt-14">
                <Link to="/main">
                    <hr className="border-t-2 border-gray-400 w-full" />

                    <button
                        className={`h-9 w-40 md:h-12 md:w-80 rounded font-bold px-3 mt-5 md:mt-10 ml-50 md:ml-250 text-white text-xs md:text-sm
                            ${selectedIndex !== null
                                ? "bg-blue-700 cursor-pointer"
                                : "bg-gray-400"
                            }`}
                        disabled={selectedIndex === null}
                    >
                        Continue
                    </button>
                </Link>
            </footer>
        </div>
    );
};

export default Purpose;