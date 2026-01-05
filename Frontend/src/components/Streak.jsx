import { useCallback } from "react";

export const Streak = () => {
    const readStreak = () => {
        try {
            return JSON.parse(localStorage.getItem("streak")) || {};
        } catch {
            return {};
        }
    };

    const updateDailyStreak = useCallback(() => {
        const today = new Date().toDateString();
        const saved = readStreak();

        let streak = saved.streak ?? 0;
        const lastDate = saved.lastDate;

        if (!lastDate) {
            streak = 1;
        } else {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toDateString();

            if (lastDate === yesterdayStr) {
                streak += 1;
            } else if (lastDate !== today) {
                streak = 1;
            }
        }

        localStorage.setItem(
            "streak",
            JSON.stringify({ streak, lastDate: today })
        );

        return streak;
    }, []);

    const getStreak = useCallback(() => {
        const saved = readStreak();
        return saved?.streak ?? 0;
    }, []);

    return { updateDailyStreak, getStreak };
};