import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

export default function Logout({ className = "" }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleLogout() {
        if (loading) return;
        setLoading(true);

        try {
            await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
                method: "GET",
                credentials: "include"        // <-- clear cookie in backend
            });
        } catch (err) {
            console.error("Logout failed:", err);
        }


        localStorage.removeItem("setupComplete");

        setOpen(false);
        setLoading(false);
        window.location.href = "/";

    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className={`font-serif cursor-pointer text-black hover:text-blue-700 ${className}`}
            >
                Logout
            </button>

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
                                    className="px-4 py-2 rounded-xl border bg-gray-200 hover:cursor-pointer"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleLogout}
                                    disabled={loading}
                                    className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:cursor-pointer disabled:opacity-60"
                                >
                                    {loading ? "Logging out..." : "Yes, logout"}
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}