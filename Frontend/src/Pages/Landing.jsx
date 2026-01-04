import React from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import FrontImage from '../images/frontt.png'

const Landing = () => {
    return (
        <>
            <div className="bg_image h-150 md:h-200">

                {/* NAVBAR */}
                <nav className="w-full flex items-center p-4 pl-1 justify-between gap-x-3">
                    <p className=" text-sm pl-5 md:pl-5 cursor-pointer md:text-4xl font-bold">
                        <span className="bg-linear-to-r from-blue-800 to-red-700 bg-clip-text text-transparent">
                            Funçais
                        </span>
                    </p>
                </nav>

                {/* HERO SECTION */}
                <div className="flex flex-col md:flex-row">

                    {/* LEFT CONTENT */}
                    {/* LEFT CONTENT */}
                    <div className="text-center md:text-left px-4 md:px-0">

                        {/* Headings */}
                        <p className="hidden md:block md:text-8xl font-extrabold text-black mt-5 md:mt-20 ml-5">
                            Learning
                        </p>

                        <p className="block md:hidden text-3xl font-extrabold text-black mt-5">
                            Learning French
                        </p>

                        <p className="text-xl hidden md:block md:text-8xl font-extrabold text-black mt-2 ml-5">
                            French
                        </p>

                        <p className="text-3xl md:text-8xl font-extrabold text-black mt-2 ml-0 md:ml-5">
                            Made Easy
                        </p>

                        {/* Subtitle */}
                        <p className="text-sm md:text-2xl font-serif text-blue-700 mt-2 ml-0 md:ml-5">
                            A modern and social<br className="block md:hidden" />
                            approach to learning French
                        </p>

                        {/* Signup BUTTON */}
                        <Link to="/signup">
                            <button className="relative flex items-center bg-blue-700 rounded-lg h-10 md:h-12 w-40 md:w-60 text-sm md:text-2xl text-white mt-5 md:mt-10 mx-auto md:mx-5 px-4 md:px-5 cursor-pointer animate-bounce">
                                <p>Start Learning</p>
                                <span className="absolute left-30 md:left-49 top-1/2 -translate-y-1/2 material-symbols-outlined text-blue-700 font-bold bg-white rounded-md text-[10px] h-7 w-8 md:p-2 md:text-xl md:h-10 md:w-10">
                                    arrow_outward
                                </span>
                            </button>
                        </Link>

                    </div>

                    {/* RIGHT SECTION (mobile stacks below, desktop stays row) */}
                    <div className="flex mt-20 md:mt-0">

                        {/* LEFT BUBBLES */}
                        <div className="w-20">
                            <div className="load1 relative inline-block bg-blue-700 text-white w-15 h-6 py-1 px-2 text-xs md:text-lg md:w-23 md:h-10 md:px-4 md:py-2 rounded-lg font-medium rotate-8  mt-5 md:mt-10 ml-10 md:ml-20 ">
                                Bonjour
                                <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-blue-700 "></div>
                            </div>


                            <div className="load1 relative inline-block bg-red-600 text-white w-11 h-6 py-1 px-1 text-xs md:text-lg md:w-20 md:h-10 md:px-4 md:py-2 rounded-lg font-medium -rotate-8 mt-30 md:mt-90 ml-5 md:ml-5">
                                Merci
                                <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-red-600"></div>
                            </div>
                            <span className="load1 material-symbols-outlined text-blue-700 scale-[2] md:scale-[4] mt-10 md:mt-32 ml-30 md:ml-10  -rotate-145 md:-rotate-130">
                                switch_access_shortcut
                            </span>
                            <div className="block md:hidden w-55 md:w-70 ml-5 md:ml-90 relative -pt-7 md:pt-30 ">
                                <p className="load1 text-xs md:text-lg">
                                    Your practical <br className='block md:hidden' /> guide to ordering at a{' '}
                                    <span className="font-serif text-red-600">Parisian café</span>{' '}and having your first simple French conversation.
                                </p>
                            </div>


                        </div>

                        {/* CENTER IMAGE */}
                        <div className="w-full md:w-130 flex justify-center md:justify-start">
                            <img
                                className="h-60 md:h-170 object-contain"
                                src={FrontImage}
                                alt="Front visual"
                            />
                        </div>

                        {/* RIGHT BUBBLES + TEXT */}
                        <div>
                            <span className="load1 material-symbols-outlined text-red-600 scale-[2] md:scale-[4] relative -top-3 md:mt-20 rotate-90 mr-2 md:mr-10">
                                switch_access_shortcut
                            </span>

                            <div className="w-30 md:w-50 -top-2 md:mt-5">
                                <p className="load1 text-xs md:text-lg">
                                    Stop studying textbooks and start watching native{' '}
                                    <span className="text-blue-700">French videos</span> with
                                    interactive learning.
                                </p>
                            </div>

                            <div className="load1 relative inline-block bg-red-600 text-white text-xs px-2 py-1 md:text-lg md:px-4 md:py-2 rounded-lg font-medium rotate-10 mt-7 md:mt-35 h-7 w-29 md:h-10 md:w-45 right-2 md:right-5">
                                Comment Ça va?
                                <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-red-600"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Landing