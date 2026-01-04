const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    FName: { type: String, required: true },
    LName: { type: String, required: true },
    date: { type: Date, required: true }, // Birthdate
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    level: { type: String }
}, { timestamps: true });  // <-- This automatically adds createdAt & updatedAt

module.exports = mongoose.model("User", UserSchema);