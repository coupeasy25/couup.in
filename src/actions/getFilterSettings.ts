"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { FilterSettings } from "@/models/FilterSettings";

export default async function getFilterSettings() {
  try {
    await connectToDatabase();
    
    let settings = await FilterSettings.findOne().lean();

    const defaultSettings = {
      categories: ['Sort', 'Price', 'Customer Rating', 'Amenities', 'Property type'],
      sortOptions: ['popularity', 'Customer Rating: Highest First', 'Price: Lowest first', 'Lowest Price & Best Rated'],
      customerRatings: [5, 4, 3],
      propertyTypes: ['Hotel', 'Resort'],
      amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Free parking', 'Pool', 'TV', 'Washer'],
      priceRanges: [
        { label: 'Any' },
        { label: 'Under ₹2000', max: 2000 },
        { label: '₹2000 - ₹5000', min: 2000, max: 5000 },
        { label: '₹5000 - ₹10000', min: 5000, max: 10000 },
        { label: 'Above ₹10000', min: 10000 },
      ],
      showPriceFilter: true,
      showRoomsFilter: true,
      showPropertyTypeFilter: true,
      showCustomerRatingFilter: true,
      bookingOptions: ['Free cancellation'],
      houseRules: ['Allows pets'],
    };
    if (!settings) {
      // Don't create here, just return defaults to avoid unnecessary writes in server actions
      return defaultSettings;
    }

    // Merge defaults for missing fields due to old schema
    if (!settings.categories || settings.categories.length === 0) settings.categories = defaultSettings.categories;
    if (!settings.sortOptions || settings.sortOptions.length === 0) settings.sortOptions = defaultSettings.sortOptions;
    if (!settings.customerRatings || settings.customerRatings.length === 0) settings.customerRatings = defaultSettings.customerRatings;
    if (settings.showPriceFilter === undefined) settings.showPriceFilter = defaultSettings.showPriceFilter;
    if (settings.showRoomsFilter === undefined) settings.showRoomsFilter = defaultSettings.showRoomsFilter;
    if (settings.showPropertyTypeFilter === undefined) settings.showPropertyTypeFilter = defaultSettings.showPropertyTypeFilter;
    if (settings.showCustomerRatingFilter === undefined) settings.showCustomerRatingFilter = defaultSettings.showCustomerRatingFilter;
    if (!settings.bookingOptions || settings.bookingOptions.length === 0) settings.bookingOptions = defaultSettings.bookingOptions;
    if (!settings.houseRules || settings.houseRules.length === 0) settings.houseRules = defaultSettings.houseRules;
    
    return {
      ...settings,
      _id: settings._id.toString(),
      priceRanges: settings.priceRanges?.map((pr: any) => ({
        label: pr.label,
        min: pr.min,
        max: pr.max
      })) || defaultSettings.priceRanges,
      createdAt: settings.createdAt ? settings.createdAt.toISOString() : null,
      updatedAt: settings.updatedAt ? settings.updatedAt.toISOString() : null,
    };
  } catch (error: any) {
    console.error("GET_FILTER_SETTINGS_ERROR", error);
    return null;
  }
}
