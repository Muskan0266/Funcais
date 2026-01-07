import React, { useEffect, useState } from 'react'
import { useSwipeable } from "react-swipeable"
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ac from '../images/ac.png'
import bathtub from '../images/bathtub.png'
import lamp from '../images/lamp.png'
import laptop from '../images/laptop.png'
import sofa from '../images/sofa.png'
import StudyTime from '../components/StudyTime'

const getCookie = (name) => {
    const match = document.cookie.match(
        new RegExp("(^| )" + name + "=([^;]+)")
    )
    return match ? decodeURIComponent(match[2]) : null
}

const setCookie = (name, value, days = 365) => {
    const expires = new Date()
    expires.setDate(expires.getDate() + days)

    document.cookie =
        `${name}=${encodeURIComponent(value)};` +
        `expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

const removeCookie = (name) => {
    document.cookie =
        `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;SameSite=Lax`
}

const Cards = () => {
    const { studyMinutes } = StudyTime()

    let savedData = {}
    try {
        savedData = JSON.parse(getCookie("progress") || "{}")
    } catch {
        savedData = {}
    }

    const [currentIndex, setCurrentIndex] = useState(savedData.currentIndex ?? 0)
    const [flashColor, setFlashColor] = useState("")
    const [showCorrect, setshowCorrect] = useState(null)
    const [swipedCount, setSwipedCount] = useState(savedData.swipedCount ?? 0)
    const [countCorrect, setcountCorrect] = useState(savedData.countCorrect ?? 0)
    const [countIncorrect, setcountIncorrect] = useState(savedData.countIncorrect ?? 0)
    const [quizCompleted, setQuizCompleted] = useState(savedData.quizCompleted ?? false)
    const [streakDate, setstreakDate] = useState(savedData.streakDate ?? null)
    const [Streak, setStreak] = useState(savedData.Streak ?? 0)
    const [cardsChallenge, setcardsChallenge] = useState(false)

    const cards = [
        { img: bathtub, name: "Le frigo", correctName: "La baignore", margin: "-top-5", height: "h-70 md:h-80", width: "w-70 md:w-80" },
        { img: ac, name: "La pomme", correctName: "Le climatiseur", margin: "pt-15", height: "h-80", width: "w-80" },
        { img: laptop, name: "L'ordinateur portable", margin: "-top-3", correctName: "L'ordinateur portable", height: "h-65 md:h-80", width: "w-65 md:w-80" },
        { img: sofa, name: "La chaise", correctName: "Le canapé", margin: "-top-5", height: "h-70 md:h-80", width: "w-70 md:w-80" },
        { img: lamp, name: "La lampe", correctName: "La lampe", margin: "-top-5", height: "h-70 md:h-80", width: "w-55 md:w-65" },
    ]

    // ---------- SAVE PROGRESS (cookie) ----------
    useEffect(() => {
        const data = {
            currentIndex,
            countCorrect,
            countIncorrect,
            swipedCount,
            quizCompleted,
            cardsChallenge,
            streakDate,
            Streak,
            lastActiveDate: new Date().toDateString()
        }

        setCookie("progress", JSON.stringify(data))
    }, [
        currentIndex,
        countCorrect,
        countIncorrect,
        swipedCount,
        quizCompleted,
        cardsChallenge,
        streakDate,
        Streak
    ])

    // ---------- streak ----------
    useEffect(() => {
        if (!quizCompleted) return

        const today = new Date().toDateString()

        if (streakDate !== today) {
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            const yesterdayStr = yesterday.toDateString()

            setStreak(prev => (streakDate === yesterdayStr ? prev + 1 : 1))
            setstreakDate(today)
        }
    }, [quizCompleted])

    // ---------- challenge complete ----------
    useEffect(() => {
        if (swipedCount === cards.length) setcardsChallenge(true)
    }, [swipedCount])

    const resetProgress = () => {
        removeCookie("progress")
        setCurrentIndex(0)
        setSwipedCount(0)
        setcountCorrect(0)
        setcountIncorrect(0)
        setQuizCompleted(false)
        setstreakDate(null)
        setcardsChallenge(false)
    }



    const goNext = () => {
        setFlashColor("")
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(i => i + 1)
        } else {
            alert("🎉 You've completed all cards!")
            setQuizCompleted(true)
        }
    }

    const CorrectButton = () => {
        if (currentIndex >= cards.length) return

        const card = cards[currentIndex]
        const isCorrect = card.name === card.correctName

        if (isCorrect) {
            setFlashColor("green")
            setTimeout(() => {
                if (currentIndex < cards.length) {
                    setcountCorrect(prev => prev + 1)
                    setSwipedCount(prev => Math.min(prev + 1, cards.length))
                }
                setFlashColor("")
                goNext()
            }, 800)
        } else {
            setFlashColor("red")
            setTimeout(() => {
                setshowCorrect(card.correctName)
                setTimeout(() => {
                    if (currentIndex < cards.length) {
                        setcountIncorrect(prev => prev + 1)
                        setSwipedCount(prev => Math.min(prev + 1, cards.length))
                    }
                    setshowCorrect(null)
                    goNext()
                }, 2000)
            }, 800)
        }
    }

    const IncorrectButton = () => {
        if (currentIndex >= cards.length) return

        const card = cards[currentIndex]
        const isActuallyIncorrect = card.name !== card.correctName

        if (isActuallyIncorrect) {
            setFlashColor("green")
            setTimeout(() => {
                setshowCorrect(card.correctName)
                setTimeout(() => {
                    if (currentIndex < cards.length) {
                        setcountCorrect(prev => prev + 1)
                        setSwipedCount(prev => Math.min(prev + 1, cards.length))
                    }
                    setFlashColor("")
                    goNext()
                }, 2000)
            }, 800)
        } else {
            setFlashColor("red")
            setTimeout(() => {
                if (currentIndex < cards.length) {
                    setcountIncorrect(prev => prev + 1)
                    setSwipedCount(prev => Math.min(prev + 1, cards.length))
                }
                goNext()
            }, 800)
        }
    }

    const swipe = useSwipeable({
        onSwipedRight: quizCompleted ? undefined : CorrectButton,
        onSwipedLeft: quizCompleted ? undefined : IncorrectButton,
        preventScrollOnSwipe: true,
        delta: 10,
        trackTouch: true,
        trackMouse: true,
    })

    const progress = (swipedCount / cards.length) * 100
    const correctPercent = (countCorrect / cards.length) * 100
    const incorrectPercent = (countIncorrect / cards.length) * 100

    const speak = (text, lang = 'fr-FR') => {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = lang
        const voices = window.speechSynthesis.getVoices()
        const voice = voices.find(v => v.lang.startsWith("fr"))
        if (voice) utterance.voice = voice
        window.speechSynthesis.speak(utterance)
    }

    useEffect(() => {
        window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices()
    }, [])

    useEffect(() => {
        setshowCorrect(null)
    }, [currentIndex])

    const card = cards[currentIndex]

    if (!card) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-4xl font-bold">🎉 All Cards Completed!</h1>
            </div>
        )
    }

    return (
        <div>
            <Navbar />

            <p className="font-serif text-xl md:text-3xl text-black ml-10 md:ml-122 mt-6 md:mt-5 font-bold">
                Swipe to Check your Vocab!
            </p>

            <div className="block md:flex justify-around mt-5 relative z-5 text-center md:text-left">

                {/* Word of the day */}
                <div className="mt-9 md:mt-15 ml-25 md:ml-0">
                    <div className="h-20 w-50 md:h-30 md:w-90 bg-gradient-to-r from-[#5B8DEF] to-[#F29E61] rounded-2xl mt-4 flex flex-col items-center justify-center p-2">
                        <p className="text-xs md:text-lg font-sans text-center">✨ Today's word</p>
                        <div className="flex items-center justify-center mt-1">
                            <p className="font-bold text-sm md:text-2xl">{`Merveilleux`}</p>
                            <span onClick={() => speak('Merveilleux')} className="material-symbols-outlined ml-2 text-center cursor-pointer">
                                volume_up
                            </span>
                        </div>
                        <p className="font-serif text-xs md:text-lg mt-1 text-center">Marvelous</p>
                    </div>

                    {/* Progress bar */}
                    <div className="h-40 md:h-50 w-60 md:w-90 bg-[#43406e] p-3 rounded-2xl mt-20 hidden md:block">
                        <div className="flex ml-2">
                            <span className="material-symbols-outlined text-white">pace</span>
                            <p className="font-bold ml-1 text-white">Your Progress</p>
                        </div>
                        <p className="text-xl pt-10 ml-20 md:ml-40 text-white">{Math.round(progress)}%</p>
                        <div className="relative mt-2 ml-1">
                            <div className="h-3 w-50 md:w-80 bg-amber-50 rounded-4xl"></div>
                            <div className="h-3 bg-blue-500 rounded-4xl absolute top-0 left-0 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Center Card */}
                <div className="flex justify-center mt-5 md:mt-10">
                    <div className="h-150">
                        <div
                            {...swipe}
                            style={{ touchAction: "none" }}
                            className={`
                                h-[450px] w-[320px] md:h-[550px] md:w-[400px] rounded-xl flex flex-col items-center justify-center 
                                shadow-xl transition-all duration-300
                                ${flashColor === "green" ? "bg-green-400" : ""}
                                ${flashColor === "red" ? "bg-red-400" : ""}
                                ${flashColor === "" ? "bg-[#5a578d]" : ""}
                            `}
                        >
                            <img src={card.img} alt={card.name} className={`${card.height} ${card.width} object-contain ${card.margin}`} />

                            <div className="h-10 flex items-center justify-center mt-3">
                                {showCorrect && (
                                    <div className="flex items-center">
                                        <p className="text-sm md:text-xl font-serif text-yellow-300">
                                            Correct Word: <span className="text-sm md:text-xl font-bold">{showCorrect}</span>
                                        </p>
                                        <button onClick={() => speak(showCorrect)} className="ml-3">
                                            <span className="material-symbols-outlined mt-1 cursor-pointer text-white">
                                                volume_up
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <p className="text-xl md:text-3xl text-white mt-1 md:mt-2 hidden md:block">{card.name}</p>
                            <div className='flex md:hidden'>
                                <div>
                                    <p className="text-xl md:text-3xl text-white mt-1 md:mt-2">{card.name}</p>
                                </div>
                                <div onClick={() => speak(card.name)}>
                                    <button>
                                        <span className="material-symbols-outlined text-white mt-2 ml-1 right-10">volume_up</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-10 mt-6">
                                <button onClick={IncorrectButton} className="bg-red-600 h-10 w-10 rounded-full" disabled={quizCompleted}>
                                    <span className="material-symbols-outlined scale-[1] pt-2 text-white">close</span>
                                </button>
                                <button onClick={CorrectButton} className="bg-green-500 h-10 w-10 rounded-full" disabled={quizCompleted}>
                                    <span className="material-symbols-outlined scale-[1] pt-2 text-white">check</span>
                                </button>
                            </div>

                            <button onClick={resetProgress} className="bg-[#43406e] text-[#43406e] h-7 w-15 rounded-lg mt-4 hover:bg-red-600">Reset</button>
                        </div>

                        <p className="text-xs md:text-xl mt-3 md:mt-5 ml-8 md:ml-2">
                            Swipe right if correct, <span className="text-red-600">swipe left if incorrect</span>
                        </p>
                    </div>
                </div>

                {/* Responsive progress */}
                <div className="h-40 md:h-50 w-70 md:w-90 bg-[#43406e] p-3 rounded-2xl ml-15 relative -mt-20 block md:hidden">
                    <div className="flex ml-2">
                        <span className="material-symbols-outlined text-white">pace</span>
                        <p className="font-bold ml-1 text-white">Your Progress</p>
                    </div>
                    <p className="text-xl pt-10 text-white">{Math.round(progress)}%</p>
                    <div className="relative mt-2 ml-1">
                        <div className="h-3 w-60 md:w-80 bg-amber-50 rounded-4xl"></div>
                        <div className="h-3 bg-blue-500 rounded-4xl absolute top-0 left-0 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                {/* Stats */}
                <div>
                    <div className="bg-[#43406e] h-75 md:h-95 w-87 md:w-100 rounded-2xl p-3 mt-5 md:mt-9 mx-auto">
                        <div className="flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-white">bar_chart</span>
                            <p className="font-bold text-white">Your Stats</p>
                        </div>

                        <div className="flex justify-center mt-4">
                            <div className="grid grid-cols-2 h-50 md:h-74 w-full max-w-md md:max-w-2xl gap-2 md:gap-4">
                                <div className="bg-[#5a578d] rounded-2xl flex flex-col items-center justify-center text-center">
                                    <p className="text-xl font-mono text-white">{swipedCount}</p>
                                    <p className="text-sm text-white">Cards Completed</p>
                                </div>
                                <div className="bg-[#5a578d] rounded-2xl flex flex-col items-center justify-center text-center">
                                    <p className="text-xl font-mono text-white">{Math.round(correctPercent)}%</p>
                                    <p className="text-sm text-white">Correct</p>
                                </div>
                                <div className="bg-[#5a578d] rounded-2xl flex flex-col items-center justify-center text-center">
                                    <p className="text-xl font-mono text-white">{Math.round(incorrectPercent)}%</p>
                                    <p className="text-sm text-white">Incorrect</p>
                                </div>
                                <div className="bg-[#5a578d] rounded-2xl flex flex-col items-center justify-center text-center">
                                    <p className="text-xl font-mono text-white">{Streak}</p>
                                    <p className="text-sm text-white">Day Streak</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pronunciation */}
                    <div className="h-30 w-70 bg-[#43406e] rounded-2xl mt-4 pt-2 pl-2 hidden md:block">
                        <div className="flex ml-2 gap-x-2">
                            <span className="material-symbols-outlined text-white">volume_up</span>
                            <p className="font-bold text-white">Pronunciation</p>
                        </div>

                        <button onClick={() => speak(card.name)} className="h-10 w-40 rounded-2xl bg-gray-300 cursor-pointer mt-7 ml-7">
                            Click to hear
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-10 relative z-10">
                <Footer />
            </div>
        </div>
    )
}

export default Cards