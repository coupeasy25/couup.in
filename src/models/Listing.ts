import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRoomType {
  id: string;
  type: string;
  images: string[];
  price: number;
  capacity: number;
  facilities: string[];
  inclusions: string[];
}

export interface IListing extends Document {
  title: string;
  description: string;
  imageSrc: string[];
  createdAt: Date;
  category: string;
  roomCount: number;
  bathroomCount: number;
  guestCount: number;
  locationValue: string;
  price: number;
  userId: mongoose.Types.ObjectId;
  propertyType: string;
  fullAddress: string;
  peoplePerRoom: number;
  bathroomType: string;
  amenities: string[];
  standoutAmenities: string[];
  safetyItems: string[];
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  smokingAllowed: boolean;
  petsAllowed: boolean;
  partyAllowed: boolean;
  rooms: IRoomType[];
}

const ListingSchema = new Schema<IListing>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageSrc: { type: [String], default: [] },
  category: { type: String, required: false },
  roomCount: { type: Number, required: false, default: 1 },
  bathroomCount: { type: Number, required: false, default: 1 },
  guestCount: { type: Number, required: false, default: 1 },
  locationValue: { type: String, required: false, default: '' },
  price: { type: Number, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  propertyType: { type: String, required: true },
  fullAddress: { type: String, required: true },
  peoplePerRoom: { type: Number, required: true },
  bathroomType: { type: String, required: true },
  amenities: { type: [String], default: [] },
  standoutAmenities: { type: [String], default: [] },
  safetyItems: { type: [String], default: [] },
  checkInTime: { type: String, required: false, default: '2:00 PM' },
  checkOutTime: { type: String, required: false, default: '11:00 AM' },
  cancellationPolicy: { type: String, required: false, default: 'Flexible' },
  smokingAllowed: { type: Boolean, required: false, default: false },
  petsAllowed: { type: Boolean, required: false, default: false },
  partyAllowed: { type: Boolean, required: false, default: false },
  rooms: {
    type: [{
      id: { type: String, required: true },
      type: { type: String, required: true },
      images: { type: [String], default: [] },
      price: { type: Number, required: true },
      capacity: { type: Number, required: true },
      facilities: { type: [String], default: [] },
      inclusions: { type: [String], default: [] }
    }],
    default: []
  }
}, { timestamps: true });
// Force Mongoose to recompile the schema to fix Next.js HMR dropping new fields
delete mongoose.models.Listing;

export const Listing: Model<IListing> = mongoose.models.Listing || mongoose.model<IListing>("Listing", ListingSchema);
