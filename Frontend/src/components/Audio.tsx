import React, { useRef, useState, useEffect } from "react";
import { Volume2, Play, Pause } from "lucide-react";

interface AudioPlayerProps {
    text: string;
    language?: string;
}

export default function AudioPlayer({
    text,
    language = "fr-FR",
}: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(0.7);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const wordsRef = useRef<string[]>([]);
    const wordIndexRef = useRef<number>(0);

    const stopSpeech = () => {
        if (typeof window === "undefined") return;

        window.speechSynthesis?.cancel();

        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        setIsPlaying(false);
    };

    useEffect(() => {
        wordsRef.current = text?.trim()?.length
            ? text.trim().split(/\s+/)
            : [];

        const totalWords = wordsRef.current.length;
        const estimatedDuration = (totalWords / 200) * 60;

        setDuration(estimatedDuration || 0);
        setCurrentTime(0);
        wordIndexRef.current = 0;

        stopSpeech();
    }, [text]);

    useEffect(() => {
        return () => stopSpeech();
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;

        window.speechSynthesis?.getVoices();

        const handler = () => window.speechSynthesis?.getVoices();

        window.speechSynthesis?.addEventListener?.(
            "voiceschanged",
            handler
        );

        return () =>
            window.speechSynthesis?.removeEventListener?.(
                "voiceschanged",
                handler
            );
    }, []);

    const speak = () => {
        if (typeof window === "undefined") return;

        if (isPlaying) {
            stopSpeech();
            return;
        }

        stopSpeech();

        if (wordIndexRef.current >= wordsRef.current.length) return;

        const remainingText = wordsRef.current
            .slice(wordIndexRef.current)
            .join(" ");

        const utterance = new SpeechSynthesisUtterance(remainingText);

        utterance.lang = language;

        const voices = window.speechSynthesis.getVoices();

        const langPrefix = language.split("-")[0] ?? "";

        const voice = voices.find((v) =>
            v.lang.startsWith(langPrefix)
        );

        if (voice) {
            utterance.voice = voice;
        }

        utterance.volume = volume;
        utterance.rate = 0.5;

        utterance.onend = () => {
            setIsPlaying(false);
            setCurrentTime(duration);
            wordIndexRef.current = wordsRef.current.length;

            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };

        const wordsRemaining =
            wordsRef.current.length - wordIndexRef.current;

        const interval = 0.2;

        const totalTime = (wordsRemaining / 200) * 60;

        timerRef.current = setInterval(() => {
            setCurrentTime((prev) => {
                const next = prev + interval;

                const approxIndex = Math.floor(
                    (next / duration) * wordsRef.current.length
                );

                wordIndexRef.current = approxIndex;

                if (next >= duration && timerRef.current) {
                    clearInterval(timerRef.current);
                }

                return Math.min(next, duration);
            });
        }, interval * 1000);

        utteranceRef.current = utterance;

        window.speechSynthesis.speak(utterance);

        setIsPlaying(true);
    };

    const handleVolume = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const vol = parseFloat(e.target.value);

        setVolume(vol);

        if (utteranceRef.current) {
            utteranceRef.current.volume = vol;
        }
    };

    const handleSeek = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const seekTime = parseFloat(e.target.value);

        setCurrentTime(seekTime);

        const totalWords = wordsRef.current.length;

        const wordIndex = Math.floor(
            (seekTime / duration) * totalWords
        );

        wordIndexRef.current = wordIndex;

        stopSpeech();
    };

    const formatTime = (sec: number): string => {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);

        return `${m}:${s < 10 ? "0" + s : s}`;
    };

    return (
        <div className="h-full w-full max-h-sm max-w-full md:w-220 md:h-20 md:max-h-none md:max-w-none bg-white rounded-xl p-4 flex items-center gap-2 md:gap-4 shadow-lg mt-5">
            <button
                onClick={speak}
                className="h-7 w-30 md:h-10 md:w-10 flex items-center justify-center rounded-full bg-[#5a578d] text-white"
            >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                step="0.1"
                onChange={handleSeek}
                className="w-50 md:w-72 accent-[#5a578d]"
            />

            <div className="text-sm font-semibold text-gray-700 w-36 text-right">
                {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            <Volume2 size={20} className="text-[#5a578d]" />

            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolume}
                className="w-20 md:w-24 accent-[#5a578d]"
            />
        </div>
    );
}