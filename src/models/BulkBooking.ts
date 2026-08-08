import mongoose from "mongoose";

const BulkBookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: false,
    },
    numberOfGuests: {
      type: String,
      required: false,
    },
    expectedDate: {
      type: String,
      required: false,
    },
    notes: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "contacted", "completed", "cancelled"],
    },
  },
  { timestamps: true }
);

const BulkBooking =
  mongoose.models.BulkBooking || mongoose.model("BulkBooking", BulkBookingSchema);

export default BulkBooking;
