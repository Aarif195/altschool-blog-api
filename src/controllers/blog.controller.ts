import { Request, Response } from "express";
import { BlogService } from "../services/blog.service";
import { sendError } from "../utils/helpers";
import { AuthRequest } from "../middleware/auth.middleware";

export class BlogController {
  // Create a new blog
  static async createBlog(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) return sendError(res, "Unauthorized");

      const blog = await BlogService.createBlog(req.body, req.userId);
      res.status(201).json({ blog });
    } catch (err: any) {
      sendError(res, err.message);
    }
  }
}
