import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    featuredCities: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
