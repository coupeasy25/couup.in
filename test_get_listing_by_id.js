require('dotenv').config();
const mongoose = require('mongoose');
const mongoUri = process.env.DATABASE_URL;

mongoose.connect(mongoUri).then(async () => {
  require('ts-node').register({ transpileOnly: true });
  const getListingById = require('./src/actions/getListingById').default;
  try {
    const listing = await getListingById({ listingId: "6a423f07221a15c6a8cd4857" });
    if (!listing) {
      console.log("Returned null!");
    } else {
      console.log("Returned listing. Reviews count:", listing.reviews.length);
      console.log(JSON.stringify(listing.reviews, null, 2));
    }
  } catch (err) {
    console.error("Error in getListingById:", err);
  }
  mongoose.disconnect();
}).catch(console.error);
