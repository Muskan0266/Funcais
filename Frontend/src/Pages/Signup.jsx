import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";

const Signup = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [err, setErr] = useState("");
    const [msg, setMsg] = useState("");
    const [form, setForm] = useState({
        FName: "",
        LName: "",
        date: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const API = import.meta.env.VITE_API_URL;

    function handleForm(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function submitForm(e) {
        e.preventDefault();
        setErr(""); setMsg("");

        // Password validation
        if (form.password.length < 8) {
            setErr("Password too short");
            return;
        }
        if (!/[A-Z]/.test(form.password) || !/[@#$%]/.test(form.password) || !/[0-9]/.test(form.password)) {
            setErr("Password not strong");
            return;
        }
        if (form.password !== form.confirmPassword) {
            setErr("Passwords don't match");
            return;
        }

        try {
            // 1️⃣ Signup request
            const res = await fetch(`${API}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    FName: form.FName,
                    LName: form.LName,
                    date: form.date,
                    email: form.email,
                    password: form.password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setErr(data.message || "Signup failed");
                return;
            }

            setMsg("Signup successful!");

            // 2️⃣ Auto-login immediately after signup
            const loginRes = await fetch(`${API}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email: form.email, password: form.password })
            });

            if (!loginRes.ok) {
                setErr("Signup succeeded but auto-login failed. Please login manually.");
                return;
            }

            // 3️⃣ Fetch user info and set context
            const meRes = await fetch(`${API}/auth/me`, { credentials: "include" });
            const meData = await meRes.json();
            setUser(meData.user);

            // 4️⃣ Redirect to Purpose page for new users
            navigate("/purpose");
        } catch (error) {
            console.error(error);
            setErr("Server error — please try again later.");
        }

        // reset form
        setForm({
            FName: "",
            LName: "",
            date: "",
            email: "",
            password: "",
            confirmPassword: ""
        });
    }

    return (
        <div className="bg-white/80 p-10 mt-10 md:mt-25 rounded-2xl shadow-lg w-[90%] mx-auto max-w-[1200px]">
            <h1 className="font-extrabold text-2xl md:text-5xl text-center">
                Create your{" "}
                <span className="bg-linear-to-r from-blue-800 to-red-700 bg-clip-text text-transparent">
                    Funçais
                </span>{" "}
                Account
            </h1>

            <Link to="/login">
                <p className="text-blue-600 text-center mt-3 hover:underline cursor-pointer">
                    Already a user? Login
                </p>
            </Link>

            <form onSubmit={submitForm} className="mt-10">
                <div className="flex gap-x-10 justify-center flex-wrap">
                    {/* Personal Details */}
                    <div className="p-6 bg-pink-50/20 rounded-2xl w-[450px]">
                        <h2 className="text-center font-extrabold text-lg md:text-2xl text-gray-800 mb-4">
                            Personal Details
                        </h2>

                        <label className="font-bold text-gray-500 block mt-3">First Name</label>
                        <input
                            type="text"
                            name="FName"
                            placeholder="First Name"
                            value={form.FName}
                            onChange={handleForm}
                            className="border-2 border-gray-400 p-4 h-12 md:h-15 rounded-lg w-full"
                            required
                        />

                        <label className="font-bold text-gray-500 block mt-3">Last Name</label>
                        <input
                            type="text"
                            name="LName"
                            placeholder="Last Name"
                            value={form.LName}
                            onChange={handleForm}
                            className="border-2 border-gray-400 p-4 h-12 md:h-15 rounded-lg w-full"
                            required
                        />

                        <label className="font-bold text-gray-500 block mt-3">Date of Birth</label>
                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleForm}
                            className="border-2 border-gray-400 p-4 h-12 md:h-15 rounded-lg w-full"
                            required
                        />
                    </div>

                    {/* Account Details */}
                    <div className="p-6 bg-pink-50/20 rounded-2xl w-[450px]">
                        <h2 className="text-center font-extrabold text-lg md:text-2xl text-gray-800 mb-4">
                            Account Details
                        </h2>

                        <label className="font-bold text-gray-500 block mt-3">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleForm}
                            placeholder="joe@gmail.com"
                            className="border-2 border-gray-400 p-4 h-12 md:h-15 rounded-lg w-full"
                            required
                        />

                        <label className="text-gray-500 block mt-5">
                            Suggestion: Keep your password unique and strong
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleForm}
                            placeholder="Password"
                            className="border-2 border-gray-400 p-4 h-12 md:h-15 rounded-lg w-full mt-2"
                            required
                        />

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={form.confirmPassword}
                            onChange={handleForm}
                            className="border-2 border-gray-400 p-4 h-12 md:h-15 rounded-lg w-full mt-4"
                            required
                        />
                    </div>
                </div>

                <p className="text-red-600 text-sm text-center pt-5">{err}</p>
                <p className="text-green-600 text-sm text-center pt-5">{msg}</p>

                <div className="mt-5 flex justify-center">
                    <button
                        type="submit"
                        className="bg-blue-700 w-[200px] md:w-[300px] py-3 rounded-lg text-white font-bold text-lg hover:bg-blue-800 transition duration-200"
                    >
                        Create Account
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Signup;