import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  rating: number;
  comment: string;
  listingId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  customName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  listingId: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  customName: { type: String, required: false }
}, { timestamps: true });

// Force Mongoose to recompile the schema to fix Next.js HMR dropping new fields
delete mongoose.models.Review;

export const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
