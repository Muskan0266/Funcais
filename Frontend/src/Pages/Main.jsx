import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Main = () => {
    const [index, setIndex] = useState(0);

    const arr = [
        {
            id: 0,
            content: (
                <Link to="/cards">
                    <div className="slider_swipe h-[170px] w-[300px] md:h-[350px] md:w-[550px] border-2 border-[#43406e] rounded-2xl hover:shadow-2xl hover:shadow-black/70 transition duration-300 p-5 bg-white">
                        <p className="text-sm md:text-2xl font-extrabold font-serif text-white pt-20 md:pt-59">
                            FlashCards
                        </p>
                        <p className="text-xs md:text-lg text-white mt-1">
                            Test your vocabulary knowledge with interactive swipe cards!
                        </p>
                    </div>
                </Link>
            ),
        },
        {
            id: 1,
            content: (
                <Link to="/story">
                    <div className="slider_story h-[170px] w-[300px] md:h-[350px] md:w-[550px] border-2 border-[#43406e] rounded-2xl hover:shadow-2xl hover:shadow-black/70 transition duration-300 p-5 bg-white">
                        <p className="text-sm md:text-2xl font-extrabold font-serif text-white">
                            Listening and Answering
                        </p>
                        <p className="text-xs md:text-lg text-white md:mt-1">
                            Listen to small stories and answering questions.
                        </p>
                    </div>
                </Link>
            ),
        },
        {
            id: 2,
            content: (
                <Link to="/photoWord">
                    <div className="slider_camera h-[170px] w-[300px] md:h-[350px] md:w-[550px] border-2 border-[#43406e] rounded-2xl hover:shadow-2xl hover:shadow-black/70 transition duration-300 p-5 bg-white">
                        <p className="text-sm md:text-2xl font-extrabold font-serif text-white pt-20 md:pt-59">
                            Photo-to-word
                        </p>
                        <p className="text-xs md:text-lg text-white mt-1">
                            Learn French from anything you see in just a click!
                        </p>
                    </div>
                </Link>
            ),
        },
    ];

    const next = () => setIndex((prev) => (prev + 1) % arr.length);
    const prev = () => setIndex((prev) => (prev - 1 + arr.length) % arr.length);

    return (
        <>

            <div className="relative overflow-hidden h-175 md:h-200">
                {/* PATCH BACKGROUND */}
                <div className="absolute inset-0 patch-bg"></div>
                <div className="bg-white min-h-screen pb-20">
                    <Navbar />

                    <div className="mt-10 md:mt-5 text-center md:text-left">
                        <p className="text-[#43406e] text-4xl md:text-7xl font-extrabold font-mono md:ml-120">
                            Learn French
                        </p>
                        <p className="text-[#43406e] text-4xl md:text-7xl font-extrabold font-mono md:ml-140">
                            Your way!
                        </p>
                        <p className="text-[#43406e] font-serif mt-2 text-lg md:text-2xl md:ml-130">
                            Explore and learn French in your style.
                        </p>
                    </div>

                    {/* SLIDER */}
                    <div className="md:w-full h-300 md:h-[1200px] custom-top-rounded bg-[#43406e] flex flex-col items-center justify-center relative -mt-175 md:-mt-150">
                        <div className="flex items-center justify-center gap-4 relative z-20">
                            {/* PREVIOUS */}
                            <button
                                onClick={prev}
                                className="text-white bg-black/70 h-10 w-7 md:h-15 md:w-12 rounded-full hover:bg-black/90 text-3xl mt-210 md:mt-180"
                            >
                                ‹
                            </button>

                            {/* VIEWPORT */}
                            <div className="overflow-hidden w-[300px] md:w-[550px]">
                                <div
                                    className="flex transition-transform duration-500 mt-210 md:mt-170"
                                    style={{ transform: `translateX(-${index * 100}%)` }}
                                >
                                    {arr.map((box) => (
                                        <div
                                            key={box.id}
                                            className="w-[300px] md:w-[550px] flex-shrink-0 flex justify-center"
                                        >
                                            {box.content}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* NEXT */}
                            <button
                                onClick={next}
                                className="text-white bg-black/70 h-10 w-7 md:h-15 md:w-12 rounded-full hover:bg-black/90 text-3xl mt-210 md:mt-180"
                            >
                                ›
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Main;