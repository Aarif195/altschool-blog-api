import Blog, { IBlogDocument } from "../models/blog.model";
import { IBlog } from "../types/blog";
import { Types } from "mongoose";
import { GetBlogsOptions } from "../types/blog";


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

  // Get all blogs (public)
  static async getAllBlogs(options: GetBlogsOptions) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const filter: any = { state: "published" };
    if (options.state) filter.state = options.state;
    if (options.search) {
      const regex = new RegExp(options.search, "i");
      filter.$or = [{ title: regex }, { description: regex }, { tags: regex }];
    }

    const sort: any = {};
    if (options.sortBy) {
      sort[options.sortBy] = options.sortOrder === "asc" ? 1 : -1;
    } else {
      sort.createdAt = -1;
    }

    const blogs = await Blog.find(filter)
      .populate("author", "first_name last_name email")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(filter);

    return { total, page, limit, blogs };
  }

  // Get single blog by ID
  static async getBlogById(blogId: string, requesterId?: string) {
    const blog = await Blog.findById(blogId).populate("author", "first_name last_name email");
    if (!blog) throw new Error("Blog not found");

    // Draft: only owner can view
    const isOwner = requesterId && blog.author._id.toString() === requesterId.toString();

    if (blog.state === "draft") {
      if (!requesterId || blog.author._id.toString() !== requesterId) {
        throw new Error("Unauthorized to view this draft");
      }
    }

    // Increment read_count only if published OR owner
    if (blog.state === "published" || isOwner) {
      blog.read_count += 1;
      await blog.save();
    }

    return blog;
  }


  // updateBlog
  static async updateBlog(
    blogId: string,
    requesterId: string,
    data: Partial<IBlog>
  ) {
    const blog = await Blog.findById(blogId);

    if (!blog) throw new Error("Blog not found");

    // Only owner can update
    if (blog.author.toString() !== requesterId) {
      throw new Error("Unauthorized to update this blog");
    }

    // Update fields
    if (data.title) blog.title = data.title;
    if (data.description) blog.description = data.description;
    if (data.body) {
      blog.body = data.body;
      blog.reading_time = BlogService.calculateReadingTime(data.body);
    }
    if (data.tags) blog.tags = data.tags;
    if (data.state) blog.state = data.state; // allow draft → published

    return blog.save();
  }

  // deleteBlog
  static async deleteBlog(blogId: string, requesterId: string) {
    const blog = await Blog.findById(blogId);

    if (!blog) throw new Error("Blog not found");

    // Only owner can delete
    if (blog.author.toString() !== requesterId) {
      throw new Error("Unauthorized to delete this blog");
    }

    return blog.deleteOne();
  }


}




