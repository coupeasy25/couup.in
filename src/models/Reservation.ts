import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReservation extends Document {
  userId: mongoose.Types.ObjectId;
  listingId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  createdAt: Date;
  roomType?: string;
}

const ReservationSchema = new Schema<IReservation>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  listingId: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  roomType: { type: String, required: false },
}, { timestamps: true });

export const Reservation: Model<IReservation> = mongoose.models.Reservation || mongoose.model<IReservation>("Reservation", ReservationSchema);
