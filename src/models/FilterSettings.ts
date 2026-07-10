import mongoose from "mongoose";

export interface IFilterSettings {
  categories: string[];
  sortOptions: string[];
  customerRatings: number[];
  propertyTypes: string[];
  amenities: string[];
  priceRanges: {
    label: string;
    min?: number;
    max?: number;
  }[];
  showPriceFilter: boolean;
  showRoomsFilter: boolean;
  showPropertyTypeFilter: boolean;
  showCustomerRatingFilter: boolean;
  bookingOptions: string[];
  houseRules: string[];
}

const FilterSettingsSchema = new mongoose.Schema(
  {
    categories: { type: [String], default: ['Sort', 'Price', 'Customer Rating', 'Amenities', 'Property type'] },
    sortOptions: { type: [String], default: ['popularity', 'Customer Rating: Highest First', 'Price: Lowest first', 'Lowest Price & Best Rated'] },
    customerRatings: { type: [Number], default: [5, 4, 3] },
    propertyTypes: { type: [String], default: ['Hotel', 'Resort'] },
    amenities: { type: [String], default: ['Wifi', 'Air conditioning', 'Kitchen', 'Free parking', 'Pool', 'TV', 'Washer'] },
    priceRanges: {
      type: [
        {
          label: String,
          min: Number,
          max: Number,
        }
      ],
      default: [
        { label: 'Any' },
        { label: 'Under ₹2000', max: 2000 },
        { label: '₹2000 - ₹5000', min: 2000, max: 5000 },
        { label: '₹5000 - ₹10000', min: 5000, max: 10000 },
        { label: 'Above ₹10000', min: 10000 },
      ]
    },
    showPriceFilter: { type: Boolean, default: true },
    showRoomsFilter: { type: Boolean, default: true },
    showPropertyTypeFilter: { type: Boolean, default: true },
    showCustomerRatingFilter: { type: Boolean, default: true },
    bookingOptions: { type: [String], default: ['Free cancellation'] },
    houseRules: { type: [String], default: ['Allows pets'] },
  },
  { timestamps: true }
);

export const FilterSettings = mongoose.models.FilterSettings || mongoose.model("FilterSettings", FilterSettingsSchema);
