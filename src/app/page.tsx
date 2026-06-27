export const dynamic = "force-dynamic";

import Container from "@/components/Container";
import getListings from "@/actions/getListings";
import EmptyState from "@/components/EmptyState";
import getCurrentUser from "@/actions/getCurrentUser";
import ListingCarousel from "@/components/listings/ListingCarousel";
import ListingCard from "@/components/listings/ListingCard";
import ExpandedSearch from "@/components/navbar/ExpandedSearch";
import { getSettings } from "@/actions/admin/settingsActions";
import { getBanners } from "@/actions/getBanners";
import BannerList from "@/components/home/BannerList";

interface HomeProps {
  searchParams: Promise<any>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const listings = await getListings(params);
  const currentUser = await getCurrentUser();
  const settings = await getSettings();
  const banners = await getBanners();
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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full min-h-[50vh] flex flex-col justify-center">
        {/* Dynamic Banners Background */}
        {Object.keys(params).length === 0 && banners && banners.length > 0 ? (
          <div className="absolute inset-0 z-0">
            <BannerList banners={banners} />
          </div>
        ) : (
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/hero-bg.png')" }}
          ></div>
        )}

        {/* Theme-colored lighter overlay for contrast */}
        <div className="absolute inset-0 bg-[#0f3d30]/20 bg-gradient-to-t from-[#0f3d30]/80 via-[#0f3d30]/10 to-transparent z-0"></div>

        <Container>
          <div className="relative z-10 flex flex-col items-center text-center pb-12 pt-24">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white tracking-wide drop-shadow-lg mb-4">
              Experience Unparalleled <span className="text-[#D4AF37] italic">Luxury</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl font-light drop-shadow-md">
              Discover exclusive hotels and resorts curated for your perfect getaway.
            </p>
          </div>
        </Container>

        {/* Floating Search Bar exactly on the boundary */}
        <div className="absolute -bottom-21 w-full px-4 z-20">
          <div className="flex justify-center drop-shadow-xl">
            <ExpandedSearch isHero />
          </div>
        </div>
      </div>

      {/* Property Carousels below Hero */}
      <div className="pt-24 pb-20">
        <Container>
          {listings.length === 0 ? (
            <EmptyState showReset />
          ) : Object.keys(params).length > 0 ? (
            <div className="flex flex-col gap-6">
              {params.locationValue && (
                <h1 className="text-2xl font-bold text-neutral-800">
                  Stays in {params.locationValue}
                </h1>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-8">
                {listings.map((listing: any) => (
                  <ListingCard
                    currentUser={currentUser}
                    key={listing.id}
                    data={listing}
                  />
                ))}
              </div>
            </div>
          ) : (
            Object.keys(groupedListings)
              .filter((location) => featuredCities.length === 0 || featuredCities.includes(location))
              .map((location) => (
                <ListingCarousel
                  key={location}
                  title={`Available in ${location}`}
                  locationName={location}
                  listings={groupedListings[location]}
                  currentUser={currentUser}
                />
              ))
          )}
        </Container>
      </div>
    </div>
  );
}
