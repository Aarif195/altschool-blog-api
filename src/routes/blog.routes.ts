import { Router } from "express";
import { BlogController } from "../controllers/blog.controller";
import { authMiddleware } from "../middleware/auth.middleware";

import { optionalAuthMiddleware } from "../middleware/optionalAuth.middleware";

const router = Router();

// Protected route: only logged-in users can create blogs
router.post("/", authMiddleware, BlogController.createBlog);
router.get("/", optionalAuthMiddleware, BlogController.getAllBlogs);
router.get("/:id", optionalAuthMiddleware, BlogController.getBlog);
router.put("/:id", authMiddleware, BlogController.updateBlog);
router.delete("/:id", authMiddleware, BlogController.deleteBlog);


export default router;
