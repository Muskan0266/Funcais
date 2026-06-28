import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db";
import handleUserRoutes from "./routes/user";

const app = express();
const PORT: number = Number(process.env.PORT) || 3000;


// Connect DB
connectDB(process.env.MONGO_URL);

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: process.env.FRONTEND_URL as string,
        credentials: true,
    })
);

// Cookie config
const isProduction: boolean = process.env.NODE_ENV === "production";

interface CookieOptions {
    httpOnly: boolean;
    path: string;
    maxAge: number;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
}

const cookieOptions: CookieOptions = {
    httpOnly: true,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
};

// Routes
app.use("/", handleUserRoutes);

// Error handler
app.use(
    (err: Error, req: Request, res: Response, next: NextFunction): void => {
        console.error(err.stack);
        res.status(500).json({ message: "Server error" });
    }
);

// Start server
app.listen(PORT, (): void => {
    console.log(`Server running at http://localhost:${PORT}`);
});