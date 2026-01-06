import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logout from "../components/Logout";
import { useStreakCookie as Streak } from "../components/Streak";

const Profile = () => {
    const { updateDailyStreak } = Streak();
    const [streak, setStreak] = useState(0);
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [cardsCount, setCardsCount] = useState(0);
    const [challengeCount, setChallengeCount] = useState(0);
    const [activity, setActivity] = useState({});

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const API = import.meta.env.VITE_API_URL; // Environment variable

    // WEEKLY ACTIVITY FUNCTIONS
    const getWeeklyActivity = () => {
        return (
            JSON.parse(localStorage.getItem("weeklyActivity")) || {
                Mon: 0,
                Tue: 0,
                Wed: 0,
                Thu: 0,
                Fri: 0,
                Sat: 0,
                Sun: 0,
            }
        );
    };

    const addActivity = (amount = 1) => {
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const today = daysOfWeek[new Date().getDay()];
        const data = getWeeklyActivity();
        data[today] += amount;
        localStorage.setItem("weeklyActivity", JSON.stringify(data));
        setActivity({ ...data });
    };

    useEffect(() => {
        setActivity(getWeeklyActivity());
    }, []);

    // Challenges Count
    useEffect(() => {
        const saved =
            JSON.parse(localStorage.getItem("progress")) || {
                cardsChallenge: false,
                storyChallenge: false,
            };
        let count = 0;
        if (saved.cardsChallenge) count++;
        if (saved.storyChallenge) count++;
        setChallengeCount(count);
    }, []);

    // Cards count
    useEffect(() => {
        const progress =
            JSON.parse(localStorage.getItem("progress")) || { swipedCount: 0 };
        setCardsCount(progress.swipedCount);
    }, []);

    // Streak
    useEffect(() => {
        const newStreak = updateDailyStreak();
        setStreak(newStreak);
    }, []);

    // Fetch User via cookie-based auth
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${API}/getUserData`, {
                    method: "GET",
                    credentials: "include", // <-- send cookies
                });
                const data = await response.json();
                if (!response.ok) {
                    setError(data.message || "Failed to fetch user");
                    return;
                }
                setUser(data.user);
            } catch (err) {
                console.error(err);
                setError("Server error");
            }
        };
        fetchUser();
    }, []);

    if (error)
        return <p className="text-center mt-10 text-red-500 text-xl">{error}</p>;

    if (!user)
        return (
            <p className="text-center mt-10 text-xl text-gray-600">Loading...</p>
        );

    const study = JSON.parse(localStorage.getItem("studyTime")) || { minutes: 0 };
    const maxVal = Math.max(...Object.values(activity), 1);
    const jsDay = new Date().getDay(); // Sunday=0
    const today = days[jsDay === 0 ? 6 : jsDay - 1]; // Adjusted index

    return (
        <>
            {/* NAVIGATION */}
            <nav className="flex justify-between bg-[#43406e] h-40 px-7">
                {/* LEFT SECTION */}
                <div className="flex flex-col justify-center">
                    <p className="text-lg md:text-2xl font-serif text-white">
                        {user.FName} {user.LName}
                    </p>
                    <div className="text-sm md:text-xl text-white rounded-2xl bg-[#6a697f] w-30 md:w-40 px-1 md:px-2 mt-1 text-center">
                        <p>{user.level || "No Level Set"}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="material-symbols-outlined text-white">
                            calendar_month
                        </span>
                        <p className="text-white text-xs md:text-lg">
                            Joined:{" "}
                            <span className="font-serif">
                                {user.createdAt
                                    ? new Date(user.createdAt).toDateString()
                                    : new Date(
                                        parseInt(user._id.substring(0, 8), 16) * 1000
                                    ).toDateString()}
                            </span>
                        </p>
                    </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="flex flex-col items-center justify-center mr-5 mt-3">
                    <span className="material-symbols-outlined text-white scale-[2] md:scale-[3]">
                        account_circle
                    </span>
                    <Link to="/edit_pr">
                        <p className="text-blue-300 mt-5 cursor-pointer">Edit</p>
                    </Link>
                    <Logout className="text-white hover:text-white" />
                </div>
            </nav>

            {/* STATS SECTION */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-10 mt-10">
                {/* Day Streak */}
                <div className="h-30 md:h-50 w-70 pl-23 pt-0 md:pt-6 rounded-2xl shadow-lg shadow-black/50 bg-white bg-opacity-90 transform transition-transform duration-500 hover:scale-105">
                    <p className="text-xl md:text-3xl pl-6 mt-5 animate-bounce">🔥</p>
                    <p className="text-gray-500 text-lg mt-1 md:mt-2">Day Streak</p>
                    <p className="text-lg text-[#43406e] pl-8 transition-all duration-1000 ease-out">{streak}</p>
                </div>

                <div className="h-30 md:h-50 w-70 pl-23 pt-0 md:pt-6 rounded-2xl shadow-lg shadow-black/50 bg-white bg-opacity-90 transform transition-transform duration-500 hover:scale-105">
                    <p className="text-xl md:text-3xl pl-6 mt-5 animate-bounce">⏱️</p>
                    <p className="text-gray-500 text-lg mt-1 md:mt-2">Study Time</p>
                    <p className="text-lg text-[#43406e] pl-5 transition-all duration-1000 ease-out">{study.minutes} mins</p>
                </div>

                <div className="h-30 md:h-50 w-70 pl-18 pt-0 md:pt-6 rounded-2xl shadow-lg shadow-black/50 bg-white bg-opacity-90 transform transition-transform duration-500 hover:scale-105">
                    <p className="text-xl md:text-3xl pl-10 mt-5 animate-bounce">⭐️</p>
                    <p className="text-gray-500 text-lg mt-1 md:mt-2">Words Learned</p>
                    <p className="text-lg text-[#43406e] pl-12 transition-all duration-1000 ease-out">{cardsCount}</p>
                </div>
            </div>

            {/* PROGRESS + WEEKLY ACTIVITY */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-10 mt-15">
                {/* PROGRESS CARD */}
                <div className="h-50 md:h-70 w-70 md:w-100 rounded-2xl shadow-lg shadow-black/50 bg-white bg-opacity-90 transform transition-transform duration-500 hover:scale-105">
                    <p className="text-lg pl-10 pt-5">Progress</p>
                    <div className="flex justify-center space-x-10 pt-10 md:pt-20">
                        <div>
                            <p className="text-[#43406e] text-3xl">{challengeCount}/2</p>
                            <p className="text-gray-500 text-sm">Challenges</p>
                        </div>

                        <div>
                            <p className="text-[#43406e] text-3xl">{cardsCount} /5</p>
                            <p className="text-gray-500 text-sm">Cards Swiped</p>
                        </div>
                    </div>
                </div>

                {/* WEEKLY ACTIVITY CARD */}
                <div className="rounded-2xl shadow-lg shadow-black/50 bg-white bg-opacity-90 h-72 w-80 md:w-120 p-5 transform transition-transform duration-500 hover:scale-105">
                    <p className="text-lg pl-5 pt-1">Weekly Activity</p>
                    <div className="flex pt-10 gap-x-2 md:gap-x-4 justify-center items-end h-44">
                        {days.map((day) => {
                            const value = activity[day] || 0;
                            const maxHeightPx = 120;
                            const baseHeight = Math.max((value / maxVal) * maxHeightPx, 5);
                            const finalHeight =
                                day === today
                                    ? baseHeight + (challengeCount / 2) * maxHeightPx
                                    : baseHeight;

                            return (
                                <div key={day} className="flex flex-col items-center justify-end">
                                    <div
                                        className="w-5 md:w-10 bg-[#43406e] rounded-t-lg md:rounded-t-xl transition-all duration-700 ease-out origin-bottom"
                                        style={{ height: `${finalHeight}px` }}
                                    ></div>
                                    <p className="text-gray-500 text-sm mt-2">{day}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;