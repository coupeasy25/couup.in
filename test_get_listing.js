const getListingById = require('./src/actions/getListingById').default;
async function run() {
  const listing = await getListingById({ listingId: "6a423f07221a15c6a8cd4857" });
  console.log("Listing reviews count:", listing.reviews.length);
  console.log(JSON.stringify(listing.reviews, null, 2));
}
run();
