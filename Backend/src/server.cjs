const express = require("express")
const path = require("path")
const cors = require("cors")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const User = require("./database/User.js");
const multer = require("multer");
const fs = require("fs");

mongoose.connect("mongodb://127.0.0.1:27017/frenchify", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

const distPath = path.resolve(__dirname, "../../Frontend/dist");
const PORT = process.env.PORT || 3000
const app = express()

// Middlewares
app.use(express.static(distPath))
app.use(express.json())
app.use(cors())
app.use(cookieParser())

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

const upload = multer({ storage });

//Handling signup form data
app.post("/signup", async (req, res) => {
    const { FName, LName, date, email, password } = req.body


    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
    }


    //hashing password
    const hashedPass = await bcrypt.hash(password, 10)

    //Creating user if email doesnt exists
    const user = new User({
        FName, LName, date, email, password: hashedPass
    })
    user.save()


    return res.status(201).json({ message: "Account created successfully" });


})

//Handling Login data
app.post("/login", async (req, res) => {
    const { email, password } = req.body

    const userExist = await User.findOne({ email })
    if (!userExist) {
        return res.status(400).json({ message: "User not found, Please try to sign in" })
    }

    const match = await bcrypt.compare(password, userExist.password)
    if (!match) {
        return res.status(400).json({ message: "Wrong password" })
    }


    //Jwt
    const token = jwt.sign(
        { id: userExist._id },
        process.env.JWT_SECRET,
        { expiresIn: 3 * 24 * 60 * 60 }
    )

    //Sending token as cookie
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict"
    })
    res.json({ message: "Login successful", token });

})
//Logout
app.get("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        path: "/"
    });
    return res.json({ message: "Logged out Successfully" });

});

//level
app.post("/level", async (req, res) => {
    try {
        const { level } = req.body; // extract only the value
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Not Authenticated" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        await User.findByIdAndUpdate(decoded.id, { level });

        res.json({ message: "Level saved successfully", level });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error while saving level" });
    }
});

//Retriving logged in user data
app.get("/getUserData", async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "No token found" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        // Determine if setup is complete
        const setupComplete = !!user.level && !!user.purpose;
        res.json({ user, setupComplete });

    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
});

//Edit Profile data
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

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));

})

app.listen(PORT, () => {
    console.log(`App Running on http://localhost:${PORT}`)
})

