import { ObjectId } from "mongodb";

export interface IUser {
  _id?: ObjectId;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}
