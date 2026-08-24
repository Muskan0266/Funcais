import express, { Request, Response, NextFunction } from "express";

import cors from "cors";

import requireAuth from "../middleware/requireAuth";

import {
    handleSignup,
    handleLogin,
    getMe,
    savePurpose,
    saveLevel,
    editProfile,
    handleLogout,
} from "../controller/user";

const router = express.Router();

// PUBLIC

router.post("/signup", handleSignup);

router.post("/login", handleLogin);

// PROTECTED

router.get("/auth/me", requireAuth, getMe);

router.post("/purpose", requireAuth, savePurpose);

router.post("/level", requireAuth, saveLevel);

router.post("/editProfile", requireAuth, editProfile);

// LOGOUT

router.get("/logout", handleLogout);

export default router;