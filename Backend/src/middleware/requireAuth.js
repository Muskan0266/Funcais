const jwt = require("jsonwebtoken")
const requireAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Not authenticated" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        console.error("Auth error:", err);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = requireAuth