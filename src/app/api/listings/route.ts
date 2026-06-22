import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Listing } from "@/models/Listing";
import getCurrentUser from "@/actions/getCurrentUser";

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
    checkInTime, checkOutTime, cancellationPolicy,
    smokingAllowed, petsAllowed, partyAllowed, locationValue,
    rooms
  } = body;

  if (!imageSrc || imageSrc.length < 5 || imageSrc.length > 15) {
    return new NextResponse("Please provide between 5 and 15 images.", { status: 400 });
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
      smokingAllowed: smokingAllowed || false,
      petsAllowed: petsAllowed || false,
      partyAllowed: partyAllowed || false,
      rooms: rooms || [],
      // Keep old fields for backwards compatibility or map them
      locationValue: locationValue || fullAddress.split(',').pop()?.trim() || fullAddress,
      category: propertyType || 'Hotel',
      roomCount: 1,
      bathroomCount: 1,
      guestCount: parseInt(peoplePerRoom, 10) || 1,
    });

    return NextResponse.json(listing);
  } catch (error: any) {
    console.error("LISTING_CREATE_ERROR", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}
