import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICounter extends Document {
  _id: string; // The name of the counter, e.g., 'invoiceId'
  seq: number;
}

const CounterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

export const Counter: Model<ICounter> = mongoose.models.Counter || mongoose.model<ICounter>("Counter", CounterSchema);
