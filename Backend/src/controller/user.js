const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// SIGNUP
const handleSignup = async (req, res) => {
    try {
        const { FName, LName, date, email, password } = req.body;

        if (!FName || !LName || !email || !password)
            return res.status(400).json({ message: "Missing required fields" });

        const existing = await User.findOne({ email });
        if (existing)
            return res.status(400).json({ message: "Email already registered" });

        const hashedPass = await bcrypt.hash(password, 10);

        const user = new User({
            FName,
            LName,
            date,
            email,
            password: hashedPass,
        });

        await user.save();

        res.status(201).json({
            message: "Account created successfully",
            setupComplete: false,
        });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// LOGIN
const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return res.status(400).json({ message: "Wrong password" });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        };

        res.cookie("token", token, cookieOptions);

        res.json({
            message: "Login successful",
            setupComplete: !!user.level && !!user.purpose,
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// GET ME
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");

        res.json({
            user,
            setupComplete: !!user.level && !!user.purpose,
        });
    } catch (err) {
        console.error("Auth/me error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// SAVE PURPOSE
const savePurpose = async (req, res) => {
    try {
        const { purpose } = req.body;

        await User.findByIdAndUpdate(req.userId, { purpose });

        res.json({
            message: "Purpose saved successfully",
            purpose,
        });
    } catch (err) {
        console.error("Save purpose error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// SAVE LEVEL
const saveLevel = async (req, res) => {
    try {
        const { level } = req.body;

        await User.findByIdAndUpdate(req.userId, { level });

        res.json({
            message: "Level saved successfully",
            level,
        });
    } catch (err) {
        console.error("Save level error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// EDIT PROFILE
const editProfile = async (req, res) => {
    try {
        const { FName, LName, Level, Date } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { FName, LName, level: Level, date: Date },
            { new: true }
        ).select("-password");

        res.json({
            message: "Profile updated",
            user: updatedUser,
        });
    } catch (err) {
        console.error("EditProfile error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// LOGOUT
const handleLogout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
};

module.exports = {
    handleSignup,
    handleLogin,
    getMe,
    savePurpose,
    saveLevel,
    editProfile,
    handleLogout,
};