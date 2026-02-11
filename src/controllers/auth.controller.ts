import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { sendError } from "../utils/helpers";

export class AuthController {
  static async signup(req: Request, res: Response) {
    try {
      const { user, token } = await AuthService.signup(req.body);
      res.status(201).json({ user, token });
    } catch (err: any) {
      sendError(res, err.message);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { user, token } = await AuthService.login(email, password);
      res.status(200).json({ user, token });
    } catch (err: any) {
      sendError(res, err.message);
    }
  }
}
