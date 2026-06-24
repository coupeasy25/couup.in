import getCurrentUser from "@/actions/getCurrentUser";
import getListingById from "@/actions/getListingById";
import EmptyState from "@/components/EmptyState";
import ListingClient from "./ListingClient";
import getReservations from "@/actions/getReservations";
import getReviews from "@/actions/getReviews";
import { getSettings } from "@/actions/admin/settingsActions";
import { Metadata } from "next";

interface IParams {
  listingId?: string;
}

export async function generateMetadata({ params }: { params: Promise<IParams> }): Promise<Metadata> {
  const p = await params;
  const listing = await getListingById(p);

  if (!listing) {
    return {
      title: "Property Not Found | Couup",
      description: "The property you are looking for does not exist.",
    };
  }

  return {
    title: `${listing.title} in ${listing.locationValue} | Couup`,
    description: `Book ${listing.title} in ${listing.locationValue}. ${listing.description.substring(0, 150)}...`,
    openGraph: {
      title: `${listing.title} | Couup Hotels`,
      description: listing.description.substring(0, 150),
      images: [{ url: listing.imageSrc[0] || "/images/placeholder.jpg" }],
    },
  };
}

export default async function ListingPage({ params }: { params: Promise<IParams> }) {
  const p = await params;
  const listing = await getListingById(p);
  const reservations = await getReservations(p);
  const reviews = await getReviews(p);
  const currentUser = await getCurrentUser();
  const settings = await getSettings();

  if (!listing) {
    return <EmptyState />;
  }

  // Calculate aggregate rating for Schema
  const totalRating = reviews.reduce((acc: number, review: any) => acc + review.rating, 0);
  const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "name": listing.title,
    "description": listing.description,
    "image": listing.imageSrc,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": listing.locationValue,
      "addressCountry": "IN"
    },
    "priceRange": `₹${listing.price} - ₹${listing.price * 2}`,
    ...(averageRating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": averageRating,
        "reviewCount": reviews.length
      }
    })
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ListingClient
        listing={listing}
        reservations={reservations}
        reviews={reviews}
        currentUser={currentUser}
        settings={settings}
      />
    </>
  );
}
