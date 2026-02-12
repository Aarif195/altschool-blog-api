import User, { IUserDocument } from "../models/user.model";
import jwt from "jsonwebtoken";
import { IUser } from "../types/user";
import { sendError } from "../utils/helpers";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key"; 

export class AuthService {
    static async signup(data: IUser) {
        const existing = await User.findOne({ email: data.email });
        if (existing) throw new Error("Email already in use");

        const user = new User(data);
        await user.save();

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
        return { user, token };
    }

    static async login(email: string, password: string) {
        const user = await User.findOne({ email });
        if (!user) throw new Error("Invalid credentials");

        const isMatch = user.comparePassword(password);
        if (!isMatch) throw new Error("Invalid credentials");

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "22h" });
        return { user, token };
    }
}
