
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./db");
const handleUserRoutes = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 3000;

// Validate env
if (!process.env.MONGO_URL) {
    console.error("MONGO_URL missing");
    process.exit(1);
}

// Connect DB
connectDB(process.env.MONGO_URL);

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    })
);

// Cookie config
const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Routes
app.use("/api/users", handleUserRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Server error" });
});

// Start server
app.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}`)
);