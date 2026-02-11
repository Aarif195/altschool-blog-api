import {  Response } from "express";
import crypto from "crypto";

export function sendError(res: Response, msg: string) {
  return res.status(400).json({ error: msg });
}

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

