import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const Purpose = () => {
    const [selectedIndex, setSelectedIndex] = useState(null);

    const arr = [
        { id: 0, icon: "travel", label: "Travel", color: "#F08787", text: "text-2xl md:text-7xl", margin: "ml-25 md:ml-50" },
        { id: 1, icon: "auto_stories", label: "School", color: "#696FC7", text: "text-2xl md:text-7xl", margin: "ml-25 md:ml-50" },
        { id: 2, icon: "handshake", label: "Work", color: "#A8BBA3", text: "text-2xl md:text-7xl", margin: "ml-25 md:ml-50" },
        { id: 3, icon: "diversity_1", label: "Community", color: "#FAEAB1", text: "text-2xl md:text-6xl", margin: "ml-25 md:ml-46" },
        { id: 4, icon: "pending", label: "Others", color: "#6B3F69", text: "text-2xl md:text-7xl", margin: "ml-25 md:ml-50" }
    ];

    const handleClick = (index) => {
        setSelectedIndex(index);
    };


    return (
        <div className="h-30 md:h-100 justify-center  ">
            <p className="font-bold text-lg md:text-3xl text-black ml-12 md:ml-120 pt-12 md:pt-7">
                Hello! Why are you learning French?
            </p>

            <div className="grid grid-cols-1 grid-rows-1 md:grid-cols-2 md:grid-rows-3 gap-4 p-4 mt-10 md:mt-5 justify-items-center">
                {arr.map((card, index) => {
                    const isSelected = selectedIndex === index;


                    return (
                        <div
                            key={card.id}
                            onClick={() => handleClick(index)}
                            className={`relative block md:flex items-start h-15 w-70 md:h-40 md:w-130 rounded-2xl cursor-pointer 
                ${isSelected ? "border-2 border-black" : "border-2 border-transparent"} 
                hover:border-2 hover:border-black`}
                            style={{ backgroundColor: card.color }}
                        >
                            <div>
                                <div>
                                    <span className="material-symbols-outlined scale-[2] md:scale-[5] ml-10 md:ml-20 mt-5 md:mt-20 relative">
                                        {card.icon}
                                    </span>
                                </div>
                                <div>
                                    <p className={`${card.text} ${card.margin} font-serif relative -top-9  md:-top-15`}>
                                        {card.label}
                                    </p>
                                </div>
                            </div>

                            {isSelected && (
                                <span className="material-symbols-outlined text-black absolute right-2 top-2 scale-[2]">
                                    check
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            <footer className='mt-15'> <Link to="/level">
                <hr class="border-t-2 border-gray-400 w-full" />

                <button className={`h-9 w-40 md:h-12 md:w-80  rounded font-bold px-3 mt-5 md:mt-10 ml-50 md:ml-250 text-white text-xs md:text-sm 
                ${selectedIndex !== null ? "bg-blue-700 cursor-pointer" : "bg-gray-400"}`}
                    disabled={selectedIndex === null}>
                    Continue
                </button>
            </Link></footer>
        </div>
    );
};

export default Purpose;