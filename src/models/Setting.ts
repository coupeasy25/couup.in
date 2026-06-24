import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    featuredCities: {
      type: [String],
      default: [],
    },
    couupFeePercentage: {
      type: Number,
      default: 5,
    },
    gstPercentage: {
      type: Number,
      default: 18,
    },
  },
  { timestamps: true }
);

// Delete existing model to force recompile in dev mode
if (mongoose.models.Setting) {
  delete mongoose.models.Setting;
}

export default mongoose.model("Setting", SettingSchema);
