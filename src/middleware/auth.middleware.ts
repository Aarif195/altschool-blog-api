import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendError } from "../utils/helpers";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

export interface AuthRequest extends Request {
  userId?: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, "Authorization token missing");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    req.userId = payload.id;
    next();
  } catch (err) {
    return sendError(res, "Invalid or expired token");
  }
}
