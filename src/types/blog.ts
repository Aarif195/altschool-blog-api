import { ObjectId } from "mongodb";
import { Types } from "mongoose";

export interface IBlog {
  title: string;
  description?: string;
  body: string;
  tags?: string[];
  author: Types.ObjectId; 
  state: "draft" | "published";
  read_count: number;
  reading_time: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GetBlogsOptions {
  page?: number;
  limit?: number;
  state?: "draft" | "published";
  search?: string;
  sortBy?: "read_count" | "reading_time" | "createdAt";
  sortOrder?: "asc" | "desc";
}
