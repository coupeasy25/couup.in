export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Listing } from "@/models/Listing";
import getCurrentUser from "@/actions/getCurrentUser";
import getListings from "@/actions/getListings";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { 
    title, description, imageSrc, price,
    propertyType, fullAddress, peoplePerRoom, bathroomType,
    amenities, standoutAmenities, safetyItems,
    checkInTime, checkOutTime, cancellationPolicy, cancellationRules,
    hourlyCancellationPolicy, hourlyCancellationRules,
    smokingAllowed, petsAllowed, partyAllowed, locationValue,
    rooms, coordinates, hostContactDetails,
    allowsHourlyBooking, hourlyRates
  } = body;

  if (!imageSrc || imageSrc.length < 5 || imageSrc.length > 30) {
    return new NextResponse("Please provide between 5 and 30 images.", { status: 400 });
  }

  try {
    await connectToDatabase();

    const listing = await Listing.create({
      title,
      description,
      imageSrc,
      price: parseInt(price, 10),
      userId: currentUser._id,
      propertyType,
      fullAddress,
      peoplePerRoom: parseInt(peoplePerRoom, 10) || 1,
      bathroomType,
      amenities: amenities || [],
      standoutAmenities: standoutAmenities || [],
      safetyItems: safetyItems || [],
      checkInTime: checkInTime || '2:00 PM',
      checkOutTime: checkOutTime || '11:00 AM',
      cancellationPolicy: cancellationPolicy || 'Flexible',
      cancellationRules: cancellationRules || [],
      hourlyCancellationPolicy: hourlyCancellationPolicy || '',
      hourlyCancellationRules: hourlyCancellationRules || [],
      smokingAllowed: smokingAllowed || false,
      petsAllowed: petsAllowed || false,
      partyAllowed: partyAllowed || false,
      rooms: rooms || [],
      coordinates: coordinates || { lat: 0, lng: 0 },
      // Keep old fields for backwards compatibility or map them
      locationValue: locationValue || fullAddress.split(',').pop()?.trim() || fullAddress,
      category: propertyType || 'Hotel',
      roomCount: 1,
      bathroomCount: 1,
      guestCount: parseInt(peoplePerRoom, 10) || 1,
      hostContactDetails,
      allowsHourlyBooking: allowsHourlyBooking || false,
      hourlyRates: hourlyRates || undefined,
    });

    return NextResponse.json(listing);
  } catch (error: any) {
    console.error("LISTING_CREATE_ERROR", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    
    // Call the existing getListings logic
    const listings = await getListings(params);
    
    return NextResponse.json(listings, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error: any) {
    console.error("LISTING_GET_ERROR", error);
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
