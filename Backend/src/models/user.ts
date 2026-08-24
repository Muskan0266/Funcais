import mongoose, { Schema, Document, Model } from "mongoose";

/* ===================== INTERFACE ===================== */

export interface IUser extends Document {
    FName: string;
    LName: string;
    date: Date;
    email: string;
    password: string;
    level?: string | null;
    purpose?: string | null;
}

/* ===================== SCHEMA ===================== */

const UserSchema: Schema<IUser> = new Schema(
    {
        FName: { type: String, required: true },
        LName: { type: String, required: true },
        date: { type: Date, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        level: { type: String, default: null },
        purpose: { type: String, default: null },
    },
    { timestamps: true }
);

/* ===================== MODEL ===================== */

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;