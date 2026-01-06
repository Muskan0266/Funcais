const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const fs = require("fs");
require("dotenv").config();

const User = require("./database/User.js");

// ------------------ MongoDB Connection ------------------
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// ------------------ App Setup ------------------
const app = express();
const PORT = process.env.PORT || 3000;
const distPath = path.resolve(__dirname, "../../Frontend/dist");

// ---- trust proxy for cookies behind reverse proxy (nginx/vercel/render/heroku) ----
app.set("trust proxy", 1);

// ------------------ Middlewares ------------------
app.use(express.static(distPath));
app.use(express.json());
app.use(cookieParser());

// CORS (cookie-safe)
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);



// ------------------ Cookie Options ------------------
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
};



// ------------------ Auth Middleware ------------------
const requireAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Not authenticated" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

// ------------------ Routes ------------------

// Signup
app.post("/signup", async (req, res) => {
    try {
        const { FName, LName, date, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "Email already registered" });

        const hashedPass = await bcrypt.hash(password, 10);
        const user = new User({ FName, LName, date, email, password: hashedPass });
        await user.save();

        res.status(201).json({ message: "Account created successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Login  (cookie-first)
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExist = await User.findOne({ email });
        if (!userExist)
            return res
                .status(400)
                .json({ message: "User not found, Please try to sign in" });

        const match = await bcrypt.compare(password, userExist.password);
        if (!match) return res.status(400).json({ message: "Wrong password" });

        const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET, {
            expiresIn: "3d",
        });

        res.cookie("token", token, cookieOptions);
        res.json({ message: "Login successful", token });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

// Logout
app.get("/logout", (req, res) => {
    res.clearCookie("token", cookieOptions);
    res.json({ message: "Logged out Successfully" });
});

// Save Level
app.post("/level", requireAuth, async (req, res) => {
    try {
        const { level } = req.body;
        await User.findByIdAndUpdate(req.userId, { level });
        res.json({ message: "Level saved successfully", level });
    } catch {
        res.status(500).json({ message: "Server error while saving level" });
    }
});

// Get Logged-in User Data
app.get("/getUserData", requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        const setupComplete = !!user.level && !!user.purpose;
        res.json({ user, setupComplete });
    } catch {
        res.status(401).json({ message: "Invalid or expired token" });
    }
});

// Edit Profile
app.post("/editProfile", requireAuth, async (req, res) => {
    try {
        const { FName, LName, Level, Date } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { FName, LName, level: Level, date: Date },
            { new: true }
        ).select("-password");

        res.json({ message: "Profile updated", user: updatedUser });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

// Upload Profile Picture
app.post(
    "/uploadProfilePic",
    requireAuth,
    upload.single("file"),
    async (req, res) => {
        try {
            const filePath = req.file.path;
            await User.findByIdAndUpdate(req.userId, { profilePic: filePath });
            res.json({ message: "Profile picture uploaded", path: filePath });
        } catch {
            res.status(500).json({ message: "Upload failed" });
        }
    }
);

// React Fallback
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () =>
    console.log(`App Running on http://localhost:${PORT}`)
);