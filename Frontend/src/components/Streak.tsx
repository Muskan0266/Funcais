import { useCallback } from "react";

interface StreakData {
    streak?: number;
    lastDate?: string | null;
}

export function useStreakCookie() {
    const getCookie = (name: string): string | null => {
        const match = document.cookie.match(
            new RegExp("(^| )" + name + "=([^;]+)")
        );

        return match ? decodeURIComponent(match[2] ?? "") : null;
    };

    const setCookie = (
        name: string,
        value: string,
        days: number = 365
    ): void => {
        const expires = new Date();

        expires.setDate(expires.getDate() + days);

        document.cookie =
            `${name}=${encodeURIComponent(value)};` +
            `expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    };

    const readStreak = (): StreakData => {
        try {
            return JSON.parse(getCookie("streak") || "{}") as StreakData;
        } catch {
            return {};
        }
    };

    const updateDailyStreak = useCallback((): number => {
        const today = new Date().toDateString();
        const saved = readStreak();

        let streak = saved?.streak ?? 0;
        const lastDate = saved?.lastDate;

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

        setCookie(
            "streak",
            JSON.stringify({
                streak,
                lastDate: today,
            })
        );

        return streak;
    }, []);

    const getStreak = useCallback((): number => {
        const saved = readStreak();

        return saved?.streak ?? 0;
    }, []);

    const resetStreak = useCallback((): number => {
        setCookie(
            "streak",
            JSON.stringify({
                streak: 0,
                lastDate: null,
            })
        );

        return 0;
    }, []);

    return {
        updateDailyStreak,
        getStreak,
        resetStreak,
    };
}

export default useStreakCookie;