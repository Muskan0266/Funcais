const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("./database/User.js");

const app = express();
const PORT = process.env.PORT || 3000;

// ----- MONGO CONNECTION -----
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

// ----- MIDDLEWARE -----
app.set("trust proxy", 1); // for HTTPS behind proxies
app.use(express.json());
app.use(cookieParser());

// ----- CORS CONFIG -----
const corsOptions = {
    origin: process.env.FRONTEND_URL, // exact frontend URL
    credentials: true, // allow cookies cross-domain
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));


// ----- COOKIE SETTINGS -----
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
};

// ----- AUTH MIDDLEWARE -----
const requireAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Not authenticated" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        console.error("Auth error:", err);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

// ----- ROUTES -----

// SIGNUP
app.post("/signup", async (req, res) => {
    try {
        const { FName, LName, date, email, password } = req.body;

        console.log("Signup body:", req.body); // 🔹 log request body

        if (!FName || !LName || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already registered" });

        const hashedPass = await bcrypt.hash(password, 10);
        const user = new User({ FName, LName, date, email, password: hashedPass });
        await user.save();

        console.log("User created:", user); // 🔹 log user after save

        res.status(201).json({
            message: "Account created successfully",
            setupComplete: false,
        });
    } catch (err) {
        console.error("Signup error:", err); // 🔹 log full error
        res.status(500).json({ message: "Server error" });
    }
});

// LOGIN
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Wrong password" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

        res.cookie("token", token, {

            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.json({
            message: "Login successful",
            setupComplete: !!user.level && !!user.purpose,
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// LOGOUT
app.get("/logout", (req, res) => {
    res.clearCookie("token", cookieOptions);
    res.json({ message: "Logged out successfully" });
});

// SAVE LEVEL
app.post("/level", requireAuth, async (req, res) => {
    try {
        const { level } = req.body;
        await User.findByIdAndUpdate(req.userId, { level });
        res.json({ message: "Level saved successfully", level });
    } catch (err) {
        console.error("Save level error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// GET USER DATA
app.get("/getUserData", requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        res.json({ user, setupComplete: !!user.level && !!user.purpose });
    } catch (err) {
        console.error("Get user data error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// EDIT PROFILE
app.post("/editProfile", requireAuth, async (req, res) => {
    try {
        const { FName, LName, Level, Date } = req.body;
        const user = await User.findByIdAndUpdate(
            req.userId,
            { FName, LName, level: Level, date: Date },
            { new: true }
        ).select("-password");
        res.json({ message: "Profile updated", user });
    } catch (err) {
        console.error("Edit profile error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// NEW: AUTH ME ROUTE (frontend /auth/me)
app.get("/auth/me", requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        res.json({ user, setupComplete: !!user.level && !!user.purpose });
    } catch (err) {
        console.error("Auth/me error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// ----- START SERVER -----
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));