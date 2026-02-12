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

    // Get all blogs (public)
    static async getAllBlogs(req: Request, res: Response) {
        try {
            const options = {
                page: Number(req.query.page) || 1,
                limit: Number(req.query.limit) || 20,
                state: req.query.state as "draft" | "published",
                search: req.query.search as string,
                sortBy: req.query.sortBy as "read_count" | "reading_time" | "createdAt",
                sortOrder: req.query.sortOrder as "asc" | "desc",
                requesterId: (req as AuthRequest).userId, // Add requesterId
            };
            const result = await BlogService.getAllBlogs(options);
            res.json(result);
        } catch (err: any) {
            sendError(res, err.message);
        }
    }

    // Get single blog by ID
    static async getBlog(req: Request, res: Response) {
        try {
            const blogId = req.params.id as string;

            // If user is logged in, get their ID; otherwise undefined
            const requesterId = (req as AuthRequest).userId;

            const blog = await BlogService.getBlogById(blogId, requesterId);
            res.json({ blog });
        } catch (err: any) {
            sendError(res, err.message);
        }
    }

    // updateBlog
    static async updateBlog(req: AuthRequest, res: Response) {
        try {
            const blogId = req.params.id as string
            const requesterId = req.userId
            if (!requesterId) return sendError(res, "Unauthorized");

            const updatedBlog = await BlogService.updateBlog(blogId, requesterId, req.body);
            res.json({ blog: updatedBlog });
        } catch (err: any) {
            sendError(res, err.message);
        }
    }

    // deleteBlog
    static async deleteBlog(req: AuthRequest, res: Response) {
        try {
            const blogId = req.params.id as string
            const requesterId = req.userId;
            if (!requesterId) return sendError(res, "Unauthorized");

            await BlogService.deleteBlog(blogId, requesterId);
            res.status(204).send();
        } catch (err: any) {
            sendError(res, err.message);
        }
    }




}
