import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "./auth.middleware";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

export function optionalAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next();
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET) as { id: string };
        req.userId = payload.id;
    } catch (err) {
        req.userId = undefined;
    }
    next();
}
