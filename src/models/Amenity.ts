import mongoose from "mongoose";

const amenitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    isQuickFilter: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Delete existing model to force recompile in dev mode (Next.js HMR)
if (mongoose.models.Amenity) {
  delete mongoose.models.Amenity;
}

const Amenity = mongoose.model("Amenity", amenitySchema);

export default Amenity;
