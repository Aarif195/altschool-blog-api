import { ObjectId } from "mongodb";
import { Types } from "mongoose";

export interface IBlog {
  title: string;
  description?: string;
  body: string;
  tags?: string[];
  author: Types.ObjectId; // references User
  state: "draft" | "published";
  read_count: number;
  reading_time: number;
  createdAt?: Date;
  updatedAt?: Date;
}