import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";



interface AuthRequest extends Request {
    userId?: string;
}

const requireAuth = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            res.status(401).json({ message: "Not authenticated" });
            return;
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as { id: string };

        req.userId = decoded.id;

        next();
    } catch (err) {
        console.error("Auth error:", err);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default requireAuth;