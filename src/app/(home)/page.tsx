export const dynamic = "force-dynamic";

import Container from "@/components/Container";
import Image from "next/image";
import getListings from "@/actions/getListings";
import EmptyState from "@/components/EmptyState";
import getCurrentUser from "@/actions/getCurrentUser";
import ListingCarousel from "@/components/listings/ListingCarousel";
import ListingCard from "@/components/listings/ListingCard";
import ExpandedSearch from "@/components/navbar/ExpandedSearch";
import { getSettings } from "@/actions/admin/settingsActions";
import { getBanners } from "@/actions/getBanners";
import BannerList from "@/components/home/BannerList";
import PromotionalOffers from "@/components/home/PromotionalOffers";
import AdBannerDisplay from "@/components/home/AdBannerDisplay";
import { getAdBanners } from "@/actions/getAdBanners";
import FilterBar from "@/components/search/FilterBar";
import { getActiveAmenities } from "@/actions/getAmenities";
import getDestinations from "@/actions/getDestinations";
import { getOffers } from "@/actions/admin/offerActions";
import HomeSeoContent from "@/components/home/HomeSeoContent";

interface HomeProps {
  searchParams: Promise<any>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const listings = await getListings(params);
  const currentUser = await getCurrentUser();
  const settings = await getSettings();
  const banners = await getBanners();
  const adBanners = await getAdBanners();
  const amenities = await getActiveAmenities();
  const destinations = await getDestinations();
  const offers = await getOffers(); // Fetch active offers
  const featuredCities = settings?.featuredCities || [];

  // Group listings by locationValue (city)
  const groupedListings = listings.reduce((acc: any, listing: any) => {
    const location = listing.locationValue ? listing.locationValue.trim() : "Other";
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(listing);
    return acc;
  }, {});

  const locationsToDisplay = Object.keys(groupedListings).filter(
    (location) => featuredCities.includes(location)
  ).slice(0, 5);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Hero Section - ONLY show on homepage without search */}
      {Object.keys(params).length === 0 && (
        <div className="relative w-full min-h-[50vh] flex flex-col justify-center">
          {/* Dynamic Banners Background */}
          {banners && banners.length > 0 ? (
            <div className="absolute inset-0 z-0">
              <BannerList banners={banners} />
            </div>
          ) : (
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/hero-bg.png"
                alt="Hero Background"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
          )}

          {/* Theme-colored lighter overlay for contrast */}
          <div className="absolute inset-0 bg-[#0f3d30]/20 bg-gradient-to-t from-[#0f3d30]/80 via-[#0f3d30]/10 to-transparent z-0"></div>

          <Container>
            <div className="relative z-40 mt-40 flex flex-col items-center justify-center w-full">
              <div className="w-full flex justify-center drop-shadow-2xl">
                <ExpandedSearch isHero />
              </div>
            </div>
          </Container>
        </div>
      )}

      {/* Main Content below Hero */}
      <div className={`flex flex-col w-full ${Object.keys(params).length > 0 ? "pt-[100px] pb-12" : "pt-10 pb-20"}`}>
        {listings.length === 0 ? (
          <Container>
            <EmptyState showReset />
          </Container>
        ) : Object.keys(params).length > 0 ? (
          <Container>
            <div className="flex flex-col w-full gap-2">
              {/* Show Ad Banner in Search Results */}
              <AdBannerDisplay banners={adBanners} />

              <div className="flex flex-col gap-1 mt-1">
                {params.locationValue ? (
                  <>
                    <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">
                      {listings.length} {listings.length === 1 ? 'stay' : 'stays'} found
                    </p>
                    <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
                      Stays in {params.locationValue}
                    </h2>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">
                      {listings.length} {listings.length === 1 ? 'stay' : 'stays'} found
                    </p>
                    <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
                      Search Results
                    </h2>
                  </>
                )}
              </div>

              <div className="sticky top-[80px] z-30 bg-white py-1 border-b border-neutral-100 mb-2">
                <FilterBar amenities={amenities} />
              </div>

              <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                {listings.map((listing: any) => (
                  <ListingCard
                    currentUser={currentUser}
                    key={listing.id || listing._id}
                    data={listing}
                  />
                ))}
              </div>
            </div>
          </Container>
        ) : (
          <div className="flex flex-col w-full">
           

            {/* First 2 carousels */}
            {locationsToDisplay.length > 0 && (
              <Container>
                <div className="flex flex-col">
                  {locationsToDisplay.slice(0, 2).map((location) => (
                    <ListingCarousel
                      key={location}
                      title={`Available in ${location}`}
                      locationName={location}
                      listings={groupedListings[location]}
                      currentUser={currentUser}
                    />
                  ))}
                </div>
              </Container>
            )}

            {/* Promotional Offers Section */}
            {offers && offers.length > 0 && (
              <div className="flex  flex-col w-full">
                <PromotionalOffers offers={offers} />
              </div>
            )}

            {/* Remaining carousels */}
            {locationsToDisplay.length > 2 && (
              <Container>
                <div className="flex flex-col">
                  {locationsToDisplay.slice(2).map((location) => (
                    <ListingCarousel
                      key={location}
                      title={`Available in ${location}`}
                      locationName={location}
                      listings={groupedListings[location]}
                      currentUser={currentUser}
                    />
                  ))}
                </div>
              </Container>
            )}

            {/* App Promo Banner at the bottom */}
            
            {/* SEO Content Section */}
            <HomeSeoContent />
          </div>
        )}
      </div>
    </div>
  );
}
