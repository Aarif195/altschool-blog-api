import { Schema, model, Document } from "mongoose";
import { IUser } from "../types/user";
import { hashPassword } from "../utils/helpers";

export interface IUserDocument extends Omit<IUser, "_id">, Document { }

export interface IUserDocument extends Omit<IUser, "_id">, Document {
    comparePassword(candidatePassword: string): boolean;
}


const userSchema = new Schema<IUserDocument>(
    {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

// userSchema.pre<IUserDocument>("save", function (this: IUserDocument, next: any) {
//     if (!this.isModified("password")) return next();
//     this.password = hashPassword(this.password);
//     next();
// });

userSchema.pre<IUserDocument>("save", function (this: IUserDocument) {
    if (this.isModified("password")) {
        this.password = hashPassword(this.password);
    }
});


// Compare password method
userSchema.methods.comparePassword = function (candidatePassword: string) {
    const hashed = hashPassword(candidatePassword);
    return this.password === hashed;
};

export default model<IUserDocument>("User", userSchema);
