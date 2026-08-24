import { useEffect, useState } from "react";

interface StudyTimeData {
    minutes?: number;
}

const StudyTime = () => {
    const [studyMinutes, setStudyMinutes] = useState<number>(0);

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

    useEffect(() => {
        let saved: StudyTimeData;

        try {
            saved = JSON.parse(
                getCookie("studyTime") || "{}"
            ) as StudyTimeData;
        } catch {
            saved = { minutes: 0 };
        }

        const initialMinutes =
            typeof saved.minutes === "number"
                ? saved.minutes
                : 0;

        setStudyMinutes(initialMinutes);

        const start = Date.now();

        setCookie("study_start", start.toString());

        return () => {
            const end = Date.now();

            const diffMinutes = Math.floor(
                (end - start) / 60000
            );

            const updated = initialMinutes + diffMinutes;

            setCookie(
                "studyTime",
                JSON.stringify({ minutes: updated })
            );

            setCookie("study_start", "", -1);
        };
    }, []);

    return { studyMinutes };
};

export default StudyTime;