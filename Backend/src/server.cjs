const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("./database/User.js");

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

const app = express();
const PORT = process.env.PORT || 3000;
const distPath = path.resolve(__dirname, "../../Frontend/dist");

app.set("trust proxy", 1);

app.use(express.static(distPath));
app.use(express.json());
app.use(cookieParser());

// ---- CORS (cookies allowed) ----
const corsConfig = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    next();
});

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 3 * 24 * 60 * 60 * 1000,
};

const requireAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Not authenticated" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

// signup
app.post("/signup", async (req, res) => {
    try {
        const { FName, LName, date, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing)
            return res.status(400).json({ message: "Email already registered" });

        const hashedPass = await bcrypt.hash(password, 10);
        await new User({ FName, LName, date, email, password: hashedPass }).save();

        res.status(201).json({ message: "Account created successfully" });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

// login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user)
            return res.status(400).json({
                message: "User not found, Please try to sign in",
            });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Wrong password" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "3d",
        });

        res.cookie("token", token, cookieOptions);
        res.json({ message: "Login successful" });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

// logout
app.get("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
    });

    res.json({ message: "Logged out Successfully" });
});

// save level
app.post("/level", requireAuth, async (req, res) => {
    const { level } = req.body;
    await User.findByIdAndUpdate(req.userId, { level });
    res.json({ message: "Level saved successfully", level });
});

// get user data
app.get("/getUserData", requireAuth, async (req, res) => {
    const user = await User.findById(req.userId).select("-password");
    res.json({ user, setupComplete: !!user.level && !!user.purpose });
});

// edit profile
app.post("/editProfile", requireAuth, async (req, res) => {
    const { FName, LName, Level, Date } = req.body;

    const user = await User.findByIdAndUpdate(
        req.userId,
        { FName, LName, level: Level, date: Date },
        { new: true }
    ).select("-password");

    res.json({ message: "Profile updated", user });
});

// react fallback
app.get(/.*/, (req, res) =>
    res.sendFile(path.join(distPath, "index.html"))
);

app.listen(PORT, () =>
    console.log(`App Running on http://localhost:${PORT}`)
);