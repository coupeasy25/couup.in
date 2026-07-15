import mongoose from "mongoose";

const adBannerSchema = new mongoose.Schema(
  {
    imageSrc: {
      type: String,
      required: true,
    },
    link: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const AdBanner = mongoose.models.AdBanner || mongoose.model("AdBanner", adBannerSchema);

export default AdBanner;
