import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AudioPlayer from "../components/Audio";
import stories from "../data/story.json";

// Cookie helper functions
const getCookie = (name) => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
};
const setCookie = (name, value, days = 365) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

const RadioCard = ({ question, options, name, value, onSelect }) => {
    const baseClass = "block rounded-md px-4 py-2 mb-2 border cursor-pointer transition duration-150";

    return (
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
            <p className="text-lg font-semibold mb-4">{question}</p>

            {options?.map((opt, idx) => (
                <label
                    key={idx}
                    className={
                        baseClass + (value === opt ? " border-[#5a578d] bg-purple-50" : " border-gray-300 bg-white")
                    }
                >
                    <input
                        type="radio"
                        name={name}
                        className="mr-2"
                        checked={value === opt}
                        onChange={() => onSelect(opt)}
                    />
                    {opt}
                </label>
            ))}
        </div>
    );
};

const Story = () => {
    const [storyChallenge, setStoryChallenge] = useState(false);
    const [selectedStory, setSelectedStory] = useState(stories.length > 0 ? stories[0] : null);
    const [language, setLanguage] = useState("fr");
    const [answers, setAnswers] = useState({});

    if (!selectedStory)
        return <p className="text-center mt-20 text-xl">No stories available.</p>;

    const totalQuestions = selectedStory?.questions?.length || 0;
    const correctCount =
        selectedStory?.questions?.filter((q) => answers[q.id] === q.answer).length || 0;
    const score = totalQuestions ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const handleAnswerSelect = (questionId, value) =>
        setAnswers((prev) => ({ ...prev, [questionId]: value }));

    // Load story progress from cookie
    useEffect(() => {
        if (selectedStory) {
            const saved = JSON.parse(getCookie(`story-${selectedStory.id}-done`) || "false");
            setStoryChallenge(saved);
        }
    }, [selectedStory]);

    // Save story progress to cookie
    useEffect(() => {
        if (selectedStory) {
            setCookie(`story-${selectedStory.id}-done`, JSON.stringify(storyChallenge));
        }
    }, [storyChallenge, selectedStory]);

    const handleToggleDone = () => {
        const nowDone = !storyChallenge;
        setStoryChallenge(nowDone);

        // Update global progress cookie
        let progress = {};
        try {
            progress = JSON.parse(getCookie("progress") || "{}");
        } catch { }
        progress.storyChallenge = nowDone;
        setCookie("progress", JSON.stringify(progress));

        // Reset answers if unmarking
        if (!nowDone) setAnswers({});
    };

    return (
        <>
            {/* Navbar */}
            <nav className="h-20 shadow-lg shadow-black/50 bg-white flex justify-between items-center fixed top-0 left-0 right-0 z-50">
                <div className="pl-5 cursor-pointer text-sm md:text-2xl font-bold">
                    <span className="bg-linear-to-r from-blue-800 to-red-700 bg-clip-text text-transparent">
                        FrAmusant
                    </span>
                </div>
                <p className="font-bold text-black text-lg md:text-2xl">
                    Écoute et Apprends
                </p>
                <Link to="/profile">
                    <span className="material-symbols-outlined text-[#5a578d] scale-[1] md:scale-[2] pr-7">
                        account_circle
                    </span>
                </Link>
            </nav>

            {/* MAIN LAYOUT */}
            <div className="mt-24 px-4 md:px-8 flex flex-col md:flex-row gap-6">

                {/* STORY CONTENT */}
                <div className="w-full bg-purple-100 rounded-xl p-5 md:flex-1">
                    <p className="font-black text-lg md:text-3xl">{selectedStory.name}</p>

                    <AudioPlayer
                        text={language === "fr" ? selectedStory.text_fr : selectedStory.text_en}
                        language={language === "fr" ? "fr-FR" : "en-US"}
                    />

                    <div className="flex gap-3 mt-5">
                        <button
                            onClick={() => setLanguage("fr")}
                            className={`px-6 py-2 rounded-full font-semibold shadow ${language === "fr" ? "bg-[#5a578d] text-white" : "bg-white text-gray-600"}`}
                        >
                            Français
                        </button>
                        <button
                            onClick={() => setLanguage("en")}
                            className={`px-6 py-2 rounded-full font-semibold shadow ${language === "en" ? "bg-[#5a578d] text-white" : "bg-white text-gray-600"}`}
                        >
                            English
                        </button>
                    </div>

                    <p className="text-sm md:text-lg font-medium leading-7 text-gray-800 pt-3">
                        {language === "fr" ? selectedStory.text_fr : selectedStory.text_en}
                    </p>

                    <h2 className="text-lg md:text-2xl font-semibold mt-10 mb-1 text-gray-800">
                        Score: {score}%
                    </h2>

                    <h2 className="text-lg md:text-2xl font-semibold mb-3 text-gray-800">
                        Questions de Compréhension
                    </h2>

                    <div className="block md:grid md:grid-cols-3 gap-y-2 md:gap-3 space-y-4 md:space-y-0">
                        {selectedStory.questions?.map((q) => (
                            <RadioCard
                                key={q.id}
                                name={`q${q.id}`}
                                question={q.question}
                                options={q.options}
                                value={answers[q.id] || null}
                                onSelect={(value) => handleAnswerSelect(q.id, value)}
                            />
                        ))}
                    </div>

                    <div className="flex justify-center mt-5">
                        <button
                            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${storyChallenge ? "bg-green-500 text-white" : "bg-blue-500 text-white"}`}
                            onClick={handleToggleDone}
                        >
                            {storyChallenge ? "Done" : "Mark as Done"}
                        </button>
                    </div>
                </div>

                {/* STORIES CATALOGUE */}
                <div className="w-full md:w-[400px] md:h-[600px] bg-purple-100 rounded-xl overflow-y-auto">
                    <p className="text-black text-2xl font-semibold p-5">Stories Catalogue</p>

                    {stories?.map((story) => (
                        <div
                            key={story.id}
                            onClick={() => {
                                setSelectedStory(story);
                                setAnswers({});
                            }}
                            className={`rounded-xl flex justify-between w-[300px] h-[70px] mt-5 ml-5 pl-5 pt-2 cursor-pointer ${story.id === selectedStory.id ? "bg-purple-300" : "bg-white"}`}
                        >
                            <div className="font-bold">
                                <p>{story.name}</p>
                                <p>{story.time}</p>
                            </div>

                            <span className="material-symbols-outlined text-black mr-5 scale-[2] pt-4">
                                play_circle
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Story;