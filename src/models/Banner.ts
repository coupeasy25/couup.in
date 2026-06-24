import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    imageSrc: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    subtitle: {
      type: String,
    },
    link: {
      type: String,
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

const Banner = mongoose.models.Banner || mongoose.model("Banner", bannerSchema);

export default Banner;
