import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

export default function Logout({ className = "" }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    async function handleLogout() {
        await fetch("http://localhost:3000/logout", {
            method: "GET",
            credentials: "include"
        });

        localStorage.removeItem("token");
        localStorage.removeItem("setupComplete");
        navigate("/");
    }

    return (
        <>
            {/* Logout trigger button */}
            <button
                onClick={() => setOpen(true)}
                className={`font-serif cursor-pointer text-black hover:text-blue-700 ${className}`}
            >
                Logout
            </button>

            {/* Modal (via Portal) */}
            {open &&
                createPortal(
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md">
                            <h2 className="text-xl font-semibold mb-2">Log out?</h2>
                            <p className="text-gray-600 mb-6">
                                You’ll need to sign in again to continue.
                            </p>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setOpen(false)}
                                    className="px-4 py-2 rounded-xl border hover:cursor-pointer bg-gray-200"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:cursor-pointer bg-blue-800"
                                >
                                    Yes, logout
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}