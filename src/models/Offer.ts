import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOffer extends Document {
  title: string;
  subTitle?: string;
  description?: string;
  buttonText?: string;
  bgColor: string;
  textColor: string;
  descColor?: string;
  buttonBg?: string;
  buttonTextCol?: string;
  image: string;
  logo?: string;
  logoColor?: string;
  border?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema: Schema = new Schema(
  {
    title: { type: String },
    subTitle: { type: String },
    description: { type: String },
    buttonText: { type: String },
    bgColor: { type: String, required: true, default: "bg-[#bce4db]" },
    textColor: { type: String, required: true, default: "text-neutral-900" },
    descColor: { type: String },
    buttonBg: { type: String },
    buttonTextCol: { type: String },
    image: { type: String, required: true },
    logo: { type: String },
    logoColor: { type: String },
    border: { type: String },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Offer: Model<IOffer> =
  mongoose.models.Offer || mongoose.model<IOffer>("Offer", OfferSchema);

export default Offer;
