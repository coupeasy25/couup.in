import mongoose, { Schema, Document, Model } from "mongoose";
import { Counter } from "./Counter";

export interface IInvoice extends Document {
  invoiceNumber: number;
  type: string; // 'Online' | 'Offline'
  reservationId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  guestName: string;
  guestContact?: string;
  guestEmail?: string;
  propertyName?: string;
  roomType?: string;
  checkIn?: Date;
  checkOut?: Date;
  amount: number;
  taxes: number;
  total: number;
  paymentMethod?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>({
  invoiceNumber: { type: Number, unique: true }, // Will be auto-generated
  type: { type: String, enum: ['Online', 'Offline'], required: true },
  reservationId: { type: Schema.Types.ObjectId, ref: 'Reservation', required: false },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  guestName: { type: String, required: true },
  guestContact: { type: String, required: false },
  guestEmail: { type: String, required: false },
  propertyName: { type: String, required: false },
  roomType: { type: String, required: false },
  checkIn: { type: Date, required: false },
  checkOut: { type: Date, required: false },
  amount: { type: Number, required: true, default: 0 },
  taxes: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true, default: 0 },
  paymentMethod: { type: String, required: false },
  status: { type: String, enum: ['Paid', 'Pending', 'Cancelled'], default: 'Paid' }
}, { timestamps: true });

InvoiceSchema.pre("save", async function () {
  if (this.isNew && !this.invoiceNumber) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'invoiceId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      
      this.invoiceNumber = counter.seq;
    } catch (error: any) {
      throw error;
    }
  }
});

// Force Mongoose to recompile the schema to fix Next.js HMR dropping new fields or hooks
delete mongoose.models.Invoice;

export const Invoice: Model<IInvoice> = mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);
