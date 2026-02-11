import Blog, { IBlogDocument } from "../models/blog.model";
import { IBlog } from "../types/blog";
import { Types } from "mongoose";

export class BlogService {
  static async createBlog(data: IBlog, authorId: string): Promise<IBlogDocument> {
    const blog = new Blog({
      ...data,
      author: new Types.ObjectId(authorId),
      state: "draft",
      read_count: 0,
      reading_time: BlogService.calculateReadingTime(data.body),
    });

    return blog.save();
  }

  // Simple reading time calculation (words / 200 wpm)
  static calculateReadingTime(body: string): number {
    const words = body.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
  }
}
