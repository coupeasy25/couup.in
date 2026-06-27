import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGuest {
  firstName: string;
  lastName: string;
  gender: string;
  age: string;
}

export interface IReservation extends Document {
  userId: mongoose.Types.ObjectId;
  listingId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  basePrice: number;
  taxes: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  roomType?: string;
  gstState?: string;
  guests?: IGuest[];
  guestContact?: string;
  guestEmail?: string;
  status: string;
  cancellationFee?: number;
  refundAmount?: number;
  cancelledAt?: Date;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  roomsCount?: number;
}

const GuestSchema = new Schema<IGuest>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  age: { type: String, required: true }
});

const ReservationSchema = new Schema<IReservation>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  listingId: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  basePrice: { type: Number, required: true, default: 0 },
  taxes: { type: Number, required: true, default: 0 },
  totalPrice: { type: Number, required: true },
  roomType: { type: String, required: false },
  gstState: { type: String, required: false },
  guests: { type: [GuestSchema], required: false },
  guestContact: { type: String, required: false },
  guestEmail: { type: String, required: false },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled', 'Checked-in', 'Checked-out'], default: 'Pending' },
  cancellationFee: { type: Number, required: false, default: 0 },
  refundAmount: { type: Number, required: false, default: 0 },
  cancelledAt: { type: Date, required: false },
  razorpay_payment_id: { type: String, required: false },
  razorpay_order_id: { type: String, required: false },
  razorpay_signature: { type: String, required: false },
  roomsCount: { type: Number, required: false, default: 1 }
}, { timestamps: true });

export const Reservation: Model<IReservation> = mongoose.models.Reservation || mongoose.model<IReservation>("Reservation", ReservationSchema);
