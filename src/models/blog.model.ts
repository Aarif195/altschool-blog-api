import { Schema, model, Document, Types } from "mongoose";
import { IBlog } from "../types/blog";

// Extend IBlog with Mongoose Document
export interface IBlogDocument extends Omit<IBlog, "_id">, Document {}

const blogSchema = new Schema<IBlogDocument>(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String },
    body: { type: String, required: true },
    tags: [{ type: String }],
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    state: { type: String, enum: ["draft", "published"], default: "draft" },
    read_count: { type: Number, default: 0 },
    reading_time: { type: Number, default: 0 }, // in minutes
  },
  { timestamps: true }
);

export default model<IBlogDocument>("Blog", blogSchema);
