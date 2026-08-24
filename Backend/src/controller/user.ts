import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface SignupBody {
    FName: string;
    LName: string;
    date?: string;
    email: string;
    password: string;
}

interface LoginBody {
    email: string;
    password: string;
}

export const handleSignup = async (
    req: Request<{}, {}, SignupBody>,
    res: Response
): Promise<void> => {
    try {
        const { FName, LName, date, email, password } = req.body;

        if (!FName || !LName || !email || !password) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }

        const existing = await User.findOne({ email });

        if (existing) {
            res.status(400).json({ message: "Email already registered" });
            return;
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const user = new User({
            FName,
            LName,
            date,
            email,
            password: hashedPass,
        });

        await user.save();

        const token = jwt.sign(
            { id: user._id.toString() },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "User created successfully",
            token,
            user,
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// LOGIN

export const handleLogin = async (
    req: Request<{}, {}, LoginBody>,
    res: Response
): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            res.status(400).json({ message: "Wrong password" });
            return;
        }

        const token = jwt.sign(
            { id: user._id.toString() },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax" as const,
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

export const getMe = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = (req as any).userId;

        const user = await User.findById(userId).select("-password");

        res.json({
            user,
            setupComplete: !!user?.level && !!user?.purpose,
        });
    } catch (err) {
        console.error("Auth/me error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const savePurpose = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { purpose } = req.body;
        const userId = (req as any).userId;

        await User.findByIdAndUpdate(userId, { purpose });

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

export const saveLevel = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { level } = req.body;
        const userId = (req as any).userId;

        await User.findByIdAndUpdate(userId, { level });

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

export const editProfile = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { FName, LName, Level, Date } = req.body;
        const userId = (req as any).userId;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                FName,
                LName,
                level: Level,
                date: Date,
            },
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

export const handleLogout = (
    req: Request,
    res: Response
): void => {
    res.clearCookie("token");

    res.json({
        message: "Logged out successfully",
    });
};