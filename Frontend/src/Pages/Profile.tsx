import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logout from "../components/Logout";
import { useStreakCookie as Streak } from "../components/Streak";

interface User {
    _id: string;
    FName: string;
    LName: string;
    level?: string;
    createdAt?: string;
}

interface ProgressData {
    cardsChallenge?: boolean;
    storyChallenge?: boolean;
    swipedCount?: number;
}

interface WeeklyActivity {
    Mon: number;
    Tue: number;
    Wed: number;
    Thu: number;
    Fri: number;
    Sat: number;
    Sun: number;
}

const getCookie = (name: string): string | null => {
    const match = document.cookie.match(
        new RegExp("(^| )" + name + "=([^;]+)")
    );

    return match ? decodeURIComponent(match[2]) : null;
};

const setCookie = (
    name: string,
    value: string,
    days: number = 365
): void => {
    const expires = new Date(
        Date.now() + days * 864e5
    ).toUTCString();

    document.cookie = `${name}=${encodeURIComponent(
        value
    )}; expires=${expires}; path=/`;
};

const Profile = () => {
    const { updateDailyStreak } = Streak();

    const [streak, setStreak] = useState<number>(0);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string>("");
    const [cardsCount, setCardsCount] = useState<number>(0);
    const [challengeCount, setChallengeCount] =
        useState<number>(0);

    const [activity, setActivity] =
        useState<WeeklyActivity>({
            Mon: 0,
            Tue: 0,
            Wed: 0,
            Thu: 0,
            Fri: 0,
            Sat: 0,
            Sun: 0,
        });

    const days: Array<keyof WeeklyActivity> = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
    ];

    const API = import.meta.env.VITE_API_URL as string;

    const getWeeklyActivity =
        (): WeeklyActivity => {
            return (
                JSON.parse(
                    getCookie("weeklyActivity") || "null"
                ) || {
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

    useEffect(() => {
        const interval = setInterval(() => {
            setActivity(getWeeklyActivity());

            let progress: ProgressData = {};

            try {
                progress = JSON.parse(
                    getCookie("progress") || "{}"
                );
            } catch { }

            setChallengeCount(
                (progress.cardsChallenge ? 1 : 0) +
                (progress.storyChallenge ? 1 : 0)
            );

            setCardsCount(
                progress.swipedCount || 0
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setActivity(getWeeklyActivity());
    }, []);

    useEffect(() => {
        let saved: ProgressData = {};

        try {
            saved = JSON.parse(
                getCookie("progress") || "{}"
            );
        } catch { }

        let count = 0;

        if (saved.cardsChallenge) count++;
        if (saved.storyChallenge) count++;

        setChallengeCount(count);
    }, []);

    useEffect(() => {
        let progress: ProgressData = {};

        try {
            progress = JSON.parse(
                getCookie("progress") || "{}"
            );
        } catch { }

        setCardsCount(
            progress.swipedCount || 0
        );
    }, []);

    useEffect(() => {
        const newStreak =
            updateDailyStreak();

        setStreak(newStreak);
    }, [updateDailyStreak]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(
                    `${API}/auth/me`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                const data: {
                    user: User;
                    message?: string;
                } = await response.json();

                if (!response.ok) {
                    setError(
                        data.message ||
                        "Failed to fetch user"
                    );
                    return;
                }

                setUser(data.user);
            } catch (err) {
                console.error(err);
                setError("Server error");
            }
        };

        fetchUser();
    }, [API]);

    if (error) {
        return (
            <p className="text-center mt-10 text-red-500 text-xl">
                {error}
            </p>
        );
    }

    if (!user) {
        return (
            <p className="text-center mt-10 text-xl text-gray-600">
                Loading...
            </p>
        );
    }

    const study = JSON.parse(
        getCookie("studyTime") ||
        '{"minutes":0}'
    ) as { minutes: number };

    const maxVal = Math.max(
        ...Object.values(activity),
        1
    );

    const jsDay = new Date().getDay();

    const today =
        days[jsDay === 0 ? 6 : jsDay - 1];

    return (
        <>
            {/* Your existing JSX stays the same */}
        </>
    );
};

export default Profile;