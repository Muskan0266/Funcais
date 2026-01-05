import { useEffect, useState } from "react";

const StudyTime = () => {
    const [studyMinutes, setStudyMinutes] = useState(0);

    const getCookie = (name) => {
        const match = document.cookie.match(
            new RegExp("(^| )" + name + "=([^;]+)")
        );
        return match ? decodeURIComponent(match[2]) : null;
    };

    const setCookie = (name, value, days = 365) => {
        const expires = new Date();
        expires.setDate(expires.getDate() + days);

        document.cookie =
            `${name}=${encodeURIComponent(value)};` +
            `expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    };

    useEffect(() => {
        let saved;

        try {
            saved = JSON.parse(getCookie("studyTime") || "{}");
        } catch {
            saved = { minutes: 0 };
        }

        const initialMinutes =
            typeof saved.minutes === "number" ? saved.minutes : 0;

        setStudyMinutes(initialMinutes);

        const start = Date.now();
        setCookie("study_start", start.toString());

        return () => {
            const end = Date.now();
            const diffMinutes = Math.floor((end - start) / 60000);

            const updated = initialMinutes + diffMinutes;

            setCookie("studyTime", JSON.stringify({ minutes: updated }));
            setCookie("study_start", "", -1); // delete cookie
        };
    }, []);

    return { studyMinutes };
};

export default StudyTime;