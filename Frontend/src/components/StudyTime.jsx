import { useEffect, useState } from "react";

const StudyTime = () => {
    const [studyMinutes, setStudyMinutes] = useState(0);

    useEffect(() => {
        // Load saved time
        const saved = JSON.parse(localStorage.getItem("studyTime")) || { minutes: 0 };
        setStudyMinutes(saved.minutes);

        // Start timer when component mounts
        const start = Date.now();
        localStorage.setItem("study_start", start);

        return () => {
            // Stop timer when component unmounts (user leaves page)
            const end = Date.now();
            const diffMinutes = Math.floor((end - start) / 60000);

            const updated = saved.minutes + diffMinutes;

            localStorage.setItem("studyTime", JSON.stringify({ minutes: updated }));
            localStorage.removeItem("study_start");
        };
    }, []);

    return { studyMinutes };
};

export default StudyTime;