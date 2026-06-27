import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Delete existing model to force recompile in dev mode
if (mongoose.models.Notification) {
  delete mongoose.models.Notification;
}

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
