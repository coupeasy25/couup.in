import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email?: string;
  emailVerified?: Date;
  verificationOtp?: string;
  verificationOtpExpiry?: Date;
  image?: string;
  hashedPassword?: string;
  createdAt: Date;
  updatedAt: Date;
  favoriteIds: string[];
  isHost?: boolean;
}

const UserSchema = new Schema<IUser>({
  name: String,
  email: { type: String, unique: true },
  emailVerified: Date,
  verificationOtp: String,
  verificationOtpExpiry: Date,
  image: String,
  hashedPassword: String,
  favoriteIds: { type: [String], default: [] },
  isHost: { type: Boolean, default: false },
}, { timestamps: true });

// Force Mongoose to recompile the schema to fix Next.js HMR dropping new fields
delete mongoose.models.User;

// NextAuth stores in 'users' collection by default
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema, "users");
