import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";

const Signup = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [err, setErr] = useState("");
    const [msg, setMsg] = useState("");
    const [form, setForm] = useState({
        FName: "", LName: "", date: "", email: "", password: "", confirmPassword: ""
    });

    const API = import.meta.env.VITE_API_URL;

    const handleForm = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const submitForm = async (e) => {
        e.preventDefault();
        setErr(""); setMsg("");

        if (form.password.length < 8) { setErr("Password too short"); return; }
        if (!/[A-Z]/.test(form.password) || !/[@#$%]/.test(form.password) || !/[0-9]/.test(form.password)) {
            setErr("Password not strong"); return;
        }
        if (form.password !== form.confirmPassword) { setErr("Passwords don't match"); return; }

        try {
            // 1️⃣ Signup
            const res = await fetch(`${API}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form)
            });

            const data = await res.json();
            if (!res.ok) { setErr(data.message || "Signup failed"); return; }
            setMsg("Signup successful!");

            // 2️⃣ Auto-login
            const loginRes = await fetch(`${API}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email: form.email, password: form.password })
            });
            if (!loginRes.ok) { setErr("Signup succeeded but auto-login failed."); return; }

            // 3️⃣ Fetch user
            const meRes = await fetch(`${API}/auth/me`, { credentials: "include" });
            const meData = await meRes.json();
            setUser(meData.user);

            // 4️⃣ Redirect
            navigate("/purpose");
        } catch (error) {
            console.error(error);
            setErr("Server error — please try again later.");
        }

        setForm({ FName: "", LName: "", date: "", email: "", password: "", confirmPassword: "" });
    };

    return (
        <div className="bg-white/80 p-10 mt-10 md:mt-25 rounded-2xl shadow-lg w-[90%] mx-auto max-w-[1200px]">
            <h1 className="font-extrabold text-2xl md:text-5xl text-center">
                Create your <span className="bg-linear-to-r from-blue-800 to-red-700 bg-clip-text text-transparent">Funçais</span> Account
            </h1>
            <Link to="/login"><p className="text-blue-600 text-center mt-3 hover:underline cursor-pointer">Already a user? Login</p></Link>

            <form onSubmit={submitForm} className="mt-10 flex gap-x-10 flex-wrap justify-center">
                {/* Personal */}
                <div className="p-6 bg-pink-50/20 rounded-2xl w-[450px]">
                    <label>First Name</label>
                    <input type="text" name="FName" value={form.FName} onChange={handleForm} required className="border p-3 w-full mt-2" />
                    <label className="mt-2">Last Name</label>
                    <input type="text" name="LName" value={form.LName} onChange={handleForm} required className="border p-3 w-full mt-2" />
                    <label className="mt-2">Date of Birth</label>
                    <input type="date" name="date" value={form.date} onChange={handleForm} required className="border p-3 w-full mt-2" />
                </div>

                {/* Account */}
                <div className="p-6 bg-pink-50/20 rounded-2xl w-[450px]">
                    <label>Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleForm} required className="border p-3 w-full mt-2" />
                    <label className="mt-2">Password</label>
                    <input type="password" name="password" value={form.password} onChange={handleForm} required className="border p-3 w-full mt-2" />
                    <label className="mt-2">Confirm Password</label>
                    <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleForm} required className="border p-3 w-full mt-2" />
                </div>

                <p className="text-red-600 text-center mt-4">{err}</p>
                <p className="text-green-600 text-center mt-4">{msg}</p>

                <button type="submit" className="bg-blue-700 text-white py-2 px-6 rounded mt-4">Create Account</button>
            </form>
        </div>
    );
};

export default Signup; 3