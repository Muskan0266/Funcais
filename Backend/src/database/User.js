const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    FName: { type: String, required: true },
    LName: { type: String, required: true },
    date: { type: Date, required: true }, // Birthdate
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    level: { type: String, default: null },
    purpose: { type: String, default: null } // needed for setupComplete
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);