import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { FilterSettings } from "@/models/FilterSettings";
import getCurrentUser from "@/actions/getCurrentUser";
import { isAdminAuthenticated } from "@/actions/admin/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    // Attempt to get the first filter settings document
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

    // If none exists, return defaults
    if (!settings) {
      settings = await FilterSettings.create(defaultSettings);
    } else {
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
    }

    return NextResponse.json(settings, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error: any) {
    console.error("FILTER_SETTINGS_GET_ERROR", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAdmin = await isAdminAuthenticated();
    const currentUser = await getCurrentUser();

    if (!isAdmin && (!currentUser || (currentUser as any).role !== 'admin')) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { 
      propertyTypes, amenities, priceRanges, categories, sortOptions, customerRatings,
      showPriceFilter, showRoomsFilter, showPropertyTypeFilter, showCustomerRatingFilter,
      bookingOptions, houseRules
    } = body;

    await connectToDatabase();

    // Get the existing one or create a new one
    let settings = await FilterSettings.findOne();

    if (!settings) {
      settings = new FilterSettings();
    }

    if (propertyTypes !== undefined) settings.propertyTypes = propertyTypes;
    if (amenities !== undefined) settings.amenities = amenities;
    if (priceRanges !== undefined) settings.priceRanges = priceRanges;
    if (categories !== undefined) settings.categories = categories;
    if (sortOptions !== undefined) settings.sortOptions = sortOptions;
    if (customerRatings !== undefined) settings.customerRatings = customerRatings;
    if (showPriceFilter !== undefined) settings.showPriceFilter = showPriceFilter;
    if (showRoomsFilter !== undefined) settings.showRoomsFilter = showRoomsFilter;
    if (showPropertyTypeFilter !== undefined) settings.showPropertyTypeFilter = showPropertyTypeFilter;
    if (showCustomerRatingFilter !== undefined) settings.showCustomerRatingFilter = showCustomerRatingFilter;
    if (bookingOptions !== undefined) settings.bookingOptions = bookingOptions;
    if (houseRules !== undefined) settings.houseRules = houseRules;

    await settings.save();

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("FILTER_SETTINGS_POST_ERROR", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
