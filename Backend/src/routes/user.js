const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");

const {
    handleSignup,
    handleLogin,
    getMe,
    savePurpose,
    saveLevel,
    editProfile,
    handleLogout
} = require("../controller/user");

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

module.exports = router;