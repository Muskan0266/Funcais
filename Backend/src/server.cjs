const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const multer = require("multer");
require("dotenv").config();

const User = require("./database/User.js");

// ------------------ MongoDB Connection ------------------
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// ------------------ App Setup ------------------
const app = express();
const PORT = process.env.PORT || 3000;
const distPath = path.resolve(__dirname, "../../Frontend/dist");

// ------------------ Middlewares ------------------
app.use(express.static(distPath));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}));

// Optional security headers
const helmet = require("helmet");
app.use(helmet());

// ------------------ Multer Setup ------------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, "uploads/profilePics");
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif/;
        const valid = allowed.test(file.mimetype);
        if (valid) cb(null, true);
        else cb(new Error("Only image files are allowed"));
    },
});

// ------------------ Routes ------------------

// Signup
app.post("/signup", async (req, res) => {
    try {
        const { FName, LName, date, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already registered" });

        const hashedPass = await bcrypt.hash(password, 10);
        const user = new User({ FName, LName, date, email, password: hashedPass });
        await user.save();

        res.status(201).json({ message: "Account created successfully" });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExist = await User.findOne({ email });
        if (!userExist) return res.status(400).json({ message: "User not found, Please try to sign in" });

        const match = await bcrypt.compare(password, userExist.password);
        if (!match) return res.status(400).json({ message: "Wrong password" });

        const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET, { expiresIn: 3 * 24 * 60 * 60 });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });

        res.json({ message: "Login successful", token });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Logout
app.get("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
    });
    res.json({ message: "Logged out Successfully" });
});

// Save Level
app.post("/level", async (req, res) => {
    try {
        const { level } = req.body;
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Not Authenticated" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await User.findByIdAndUpdate(decoded.id, { level });

        res.json({ message: "Level saved successfully", level });
    } catch (err) {
        console.error("Level error:", err);
        res.status(500).json({ message: "Server error while saving level" });
    }
});

// Get Logged-in User Data
app.get("/getUserData", async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "No token found" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        const setupComplete = !!user.level && !!user.purpose;
        res.json({ user, setupComplete });
    } catch (err) {
        console.error("GetUserData error:", err);
        res.status(401).json({ message: "Invalid or expired token" });
    }
});

// Edit Profile
app.post("/editProfile", async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Not authenticated" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { FName, LName, Level, Date } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            decoded.id,
            { FName, LName, level: Level, date: Date },
            { new: true }
        ).select("-password");

        res.json({ message: "Profile updated", user: updatedUser });
    } catch (err) {
        console.error("EditProfile error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Upload Profile Picture
app.post("/uploadProfilePic", upload.single("file"), async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Not authenticated" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const filePath = req.file.path;

        await User.findByIdAndUpdate(decoded.id, { profilePic: filePath });
        res.json({ message: "Profile picture uploaded", path: filePath });
    } catch (err) {
        console.error("UploadProfilePic error:", err);
        res.status(500).json({ message: "Upload failed" });
    }
});

// React Routing Fallback
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
})
// ------------------ Start Server ------------------
app.listen(PORT, () => {
    console.log(`App Running on http://localhost:${PORT}`);
});