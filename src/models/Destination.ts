import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imageSrc: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Delete existing model to force recompile in dev mode
if (mongoose.models.Destination) {
  delete mongoose.models.Destination;
}

const Destination = mongoose.model("Destination", destinationSchema);

export default Destination;
