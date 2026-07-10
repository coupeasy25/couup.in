import { connectToDatabase } from "@/lib/mongodb";
import { Listing } from "@/models/Listing";
import { Reservation } from "@/models/Reservation";
import { Review } from "@/models/Review";
import mongoose from "mongoose";

function parseCheckInDateTime(dateStr: string, timeStr: string) {
  const date = new Date(dateStr);
  const isPM = timeStr.includes('PM');
  let [hourStr, minStr] = timeStr.replace(' AM', '').replace(' PM', '').split(':');
  let hour = parseInt(hourStr, 10);
  const min = parseInt(minStr, 10);
  if (isPM && hour !== 12) hour += 12;
  if (!isPM && hour === 12) hour = 0;
  date.setHours(hour, min, 0, 0);
  return date;
}

export default async function getListings(params: any) {
  try {
    await connectToDatabase();
    
    const { 
      userId,
      roomCount, 
      guestCount, 
      bathroomCount, 
      locationValue,
      startDate,
      endDate,
      isHourlyMode,
      checkInTime,
      sortBy,
      minPrice,
      maxPrice,
      minRating,
      propertyType,
      amenities,
      petsAllowed,
      freeCancellation,
      customerRatings
    } = params;

    let query: any = {};

    if (params.status) {
      query.status = params.status;
    } else if (!userId) {
      query.$or = [
        { status: 'APPROVED' },
        { status: { $exists: false } }
      ];
    }

    if (userId) {
      query.userId = userId;
    }

    if (locationValue) {
      // Case-insensitive regex search for location
      query.locationValue = { $regex: new RegExp(locationValue, "i") };
    }

    if (isHourlyMode === 'true' || isHourlyMode === true) {
      query.allowsHourlyBooking = true;
      if (!query.$and) {
        query.$and = [];
      }
      query.$and.push({
        $or: [
          { "hourlyRates.twoHours": { $gt: 0 } },
          { "hourlyRates.threeHours": { $gt: 0 } },
          { "hourlyRates.fourHours": { $gt: 0 } }
        ]
      });
    }

    if (guestCount) {
      query.guestCount = { $gte: +guestCount };
    }

    if (roomCount) {
      query.roomCount = { $gte: +roomCount };
    }

    if (bathroomCount) {
      query.bathroomCount = { $gte: +bathroomCount };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = +minPrice;
      if (maxPrice) query.price.$lte = +maxPrice;
    }

    if (propertyType) {
      // Assuming propertyType is a comma-separated string or array
      const types = Array.isArray(propertyType) ? propertyType : propertyType.split(',');
      if (types.length > 0 && types[0] !== '') {
        query.propertyType = { $in: types.map((t: string) => new RegExp(t.trim(), "i")) };
      }
    }

    if (amenities) {
      const amenitiesList = Array.isArray(amenities) ? amenities : amenities.split(',');
      if (amenitiesList.length > 0 && amenitiesList[0] !== '') {
        if (!query.$and) query.$and = [];
        // Requires all provided amenities
        amenitiesList.forEach((amenity: string) => {
          query.$and.push({
            $or: [
              { amenities: { $regex: new RegExp(amenity.trim(), "i") } },
              { standoutAmenities: { $regex: new RegExp(amenity.trim(), "i") } }
            ]
          });
        });
      }
    }

    if (petsAllowed === 'true' || petsAllowed === true) {
      query.petsAllowed = true;
    }

    if (freeCancellation === 'true' || freeCancellation === true) {
      query.cancellationPolicy = { $regex: /Flexible|Moderate/i };
    }

    if (startDate && endDate) {
      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);

      const conflictingReservations = await Reservation.find({
        $or: [
          { endDate: { $gte: parsedStartDate }, startDate: { $lte: parsedStartDate } },
          { startDate: { $lte: parsedEndDate }, endDate: { $gte: parsedEndDate } },
          { startDate: { $gte: parsedStartDate }, endDate: { $lte: parsedEndDate } }
        ]
      }).select('listingId').lean();

      if (conflictingReservations.length > 0) {
        const conflictingListingIds = conflictingReservations.map((res: any) => res.listingId);
        query._id = { $nin: conflictingListingIds };
      }
    }

    let sortObj: any = { createdAt: -1 };
    if (sortBy === 'Price: Lowest first' || sortBy === 'price_low') {
      sortObj = { price: 1 };
    }

    const listings = await Listing.find(query).sort(sortObj).lean();

    const listingIds = listings.map((l: any) => l._id);

    const ratings = await Review.aggregate([
      { $match: { listingId: { $in: listingIds } } },
      { $group: { _id: "$listingId", avgRating: { $avg: "$rating" } } }
    ]);

    const ratingMap = ratings.reduce((acc: any, curr: any) => {
      acc[curr._id.toString()] = curr.avgRating;
      return acc;
    }, {});

    let hourlyReservations: any[] = [];
    if (isHourlyMode && startDate && checkInTime) {
      const checkInDate = parseCheckInDateTime(startDate, checkInTime);
      const startOfDay = new Date(checkInDate);
      startOfDay.setHours(0,0,0,0);
      const endOfDay = new Date(checkInDate);
      endOfDay.setHours(23,59,59,999);
      
      hourlyReservations = await Reservation.find({
        listingId: { $in: listingIds },
        status: { $ne: 'Cancelled' },
        startDate: { $lte: endOfDay },
        endDate: { $gte: startOfDay }
      }).lean();
    }

    let formattedListings = listings.map((listing: any) => {
      let availableHourlySlots = { twoHours: true, threeHours: true, fourHours: true };
      
      if (isHourlyMode && startDate && checkInTime) {
        const checkInDate = parseCheckInDateTime(startDate, checkInTime);
        const maxRooms = listing.hourlyRoomCount || 1;
        
        const checkAvailability = (duration: number) => {
          const checkOutDate = new Date(checkInDate.getTime() + duration * 60 * 60 * 1000);
          let bookedRooms = 0;
          for (const res of hourlyReservations) {
            if (res.listingId.toString() === listing._id.toString()) {
              if (checkInDate < new Date(res.endDate) && checkOutDate > new Date(res.startDate)) {
                bookedRooms += (res.roomsCount || 1);
              }
            }
          }
          return bookedRooms < maxRooms;
        };

        availableHourlySlots.twoHours = checkAvailability(2);
        availableHourlySlots.threeHours = checkAvailability(3);
        availableHourlySlots.fourHours = checkAvailability(4);
      }

      return {
        ...listing,
        _id: listing._id.toString(),
        userId: listing.userId.toString(),
        createdAt: listing.createdAt ? listing.createdAt.toISOString() : null,
        updatedAt: listing.updatedAt ? listing.updatedAt.toISOString() : null,
        averageRating: ratingMap[listing._id.toString()] || 0,
        rooms: listing.rooms ? listing.rooms.map((room: any) => ({
          ...room,
          _id: room._id ? room._id.toString() : undefined
        })) : [],
        cancellationRules: listing.cancellationRules ? listing.cancellationRules.map((rule: any) => ({
          ...rule,
          _id: rule._id ? rule._id.toString() : undefined
        })) : [],
        hourlyCancellationRules: listing.hourlyCancellationRules ? listing.hourlyCancellationRules.map((rule: any) => ({
          ...rule,
          _id: rule._id ? rule._id.toString() : undefined
        })) : [],
        availableHourlySlots
      };
    });

    // Post-filter by customerRatings if provided
    if (customerRatings) {
      const targetRatings = Array.isArray(customerRatings) 
        ? customerRatings.map(Number) 
        : customerRatings.split(',').map(Number);
        
      if (targetRatings.length > 0) {
        const minSelectedRating = Math.min(...targetRatings);
        formattedListings = formattedListings.filter((l: any) => l.averageRating >= minSelectedRating);
      }
    }

    // Post-fetch filtering for minRating
    if (minRating) {
      formattedListings = formattedListings.filter(l => l.averageRating !== null && Math.floor(l.averageRating) === +minRating);
    }

    // Post-fetch sorting for rating/popularity
    if (sortBy === 'Customer Rating: Highest First' || sortBy === 'rating_high') {
      formattedListings.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    } else if (sortBy === 'Lowest Price & Best Rated') {
      formattedListings.sort((a, b) => {
        // Simple composite score or multi-level sort (price asc, then rating desc)
        if (a.price !== b.price) return a.price - b.price;
        return (b.averageRating || 0) - (a.averageRating || 0);
      });
    }

    return formattedListings;
  } catch (error: any) {
    throw new Error(error);
  }
}
