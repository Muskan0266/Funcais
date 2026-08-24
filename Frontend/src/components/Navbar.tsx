import { useState } from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    return (
        <>
            <nav className="w-full flex items-center justify-between relative z-20">
                <ul className="flex items-center gap-x-7">
                    <li className="pl-5 cursor-pointer text-lg md:text-2xl font-bold">
                        <span className="bg-linear-to-r from-blue-800 to-red-700 bg-clip-text text-transparent">
                            Funçais
                        </span>
                    </li>
                </ul>

                <div
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="h-[55px] w-[55px] md:w-[70px] md:h-[70px] rounded-b-[120px] hover:shadow-2xl hover:shadow-black/70 transition duration-300 p-5 bg-[#5a578d] mr-5 flex items-center justify-center cursor-pointer"
                >
                    <div className="flex flex-col justify-between w-8 h-6 group">
                        <span className="block h-1 w-6 md:w-8 bg-white rounded-xl transition-all duration-300 group-hover:w-7" />
                        <span className="block h-1 w-4 md:w-6 bg-white rounded-xl transition-all duration-300 group-hover:w-5" />
                        <span className="block h-1 w-6 md:w-8 bg-white rounded-xl transition-all duration-300 group-hover:w-7" />
                    </div>
                </div>
            </nav>

            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-10"
                    onClick={() => setMenuOpen(false)}
                />
            )}

            <div
                className={`fixed top-0 right-0 h-full w-[350px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out z-20 ${menuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="p-8">
                    <span
                        onClick={() => setMenuOpen(false)}
                        className="material-symbols-outlined text-gray-400 pb-15 -ml-2 cursor-pointer"
                    >
                        close
                    </span>

                    <ul className="flex flex-col gap-4 text-lg font-semibold text-black">
                        <li>
                            <Link to="/profile">
                                <span className="material-symbols-outlined text-black scale-[3] ml-4">
                                    account_circle
                                </span>
                            </Link>
                        </li>

                        <li className="mt-5 hover:text-blue-700">
                            <Link to="/main">Home</Link>
                        </li>

                        <li className="hover:text-blue-700">
                            <Link to="/cards">FlashCards</Link>
                        </li>

                        <li className="hover:text-blue-700">
                            <Link to="/photoWord">Photo-to-Word</Link>
                        </li>

                        <li className="hover:text-blue-700">
                            <Link to="/story">Story Challenge</Link>
                        </li>

                        <li className="mt-10">
                            <Logout
                                onCloseMenu={() => setMenuOpen(false)}
                            />
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Navbar;