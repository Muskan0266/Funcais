import React from 'react';
import Cloud from "../images/Cloud.png";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PhotoWord = () => {
    return (
        <>
            <div className="bg-purple-50 min-h-screen">
                <Navbar />

                <div className="flex flex-col md:flex-row items-center md:justify-around px-4 md:px-0">

                    <div className="text-center md:text-left mt-10 md:mt-40">

                        {/* Desktop heading */}
                        <p className="hidden md:block font-bold text-7xl">
                            Upload an image
                        </p>
                        <p className="hidden md:block font-bold text-7xl">
                            to learn French
                        </p>

                        <p className="hidden md:block text-2xl mt-4">
                            Upload any object image and instantly
                        </p>
                        <p className="hidden md:block text-2xl">
                            get its French name and usage
                        </p>

                        {/* Responsive heading */}
                        <p className="block md:hidden font-bold text-2xl mt-4">
                            Upload any object image and instantly get its French name and usage
                        </p>
                    </div>

                    {/* UPLOAD CARD */}
                    <div className="mt-10 md:mt-30 mx-auto md:mx-0">
                        <div className="border-4 border-dashed border-gray-500 rounded-2xl
                          h-80 w-80 md:h-100 md:w-150
                          flex items-center justify-center">

                            <div className="bg-white h-60 w-60 md:h-80 md:w-130 rounded-2xl p-5 md:p-8">

                                <div className="relative border-3 border-dashed border-gray-500 rounded-2xl
                              h-50 w-full md:h-60
                              flex flex-col items-center justify-center px-3 md:px-6">

                                    {/* Cloud */}
                                    <img
                                        className="absolute -top-4 md:-top-8 left-1/2 -translate-x-1/2
                             bg-white px-2 h-8 w-12 md:h-17 md:w-27"
                                        src={Cloud}
                                        alt="cloud icon"
                                    />

                                    <p className="font-bold text-lg md:text-3xl text-center mt-6 md:mt-0">
                                        Drop or upload your images here
                                    </p>

                                    <label
                                        htmlFor="inputt"
                                        className="bg-blue-600 text-white rounded-lg font-semibold
                             cursor-pointer hover:bg-blue-700
                             mt-6 md:mt-10
                             h-8 md:h-10 w-32 md:w-48
                             flex items-center justify-center text-xs md:text-lg"
                                    >
                                        📁 Browse Files
                                    </label>

                                    <input type="file" id="inputt" className="hidden" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default PhotoWord;