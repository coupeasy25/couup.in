const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.DATABASE_URL;

mongoose.connect(uri).then(async () => {
  const db = mongoose.connection.db;
  const listings = await db.collection('listings').find().toArray();
  let amenities = new Set();
  let propertyTypes = new Set();
  
  listings.forEach(l => {
    if (l.amenities) l.amenities.forEach(a => amenities.add(a.trim()));
    if (l.propertyType) propertyTypes.add(l.propertyType.trim());
  });
  
  ['Wifi', 'Air conditioning', 'Kitchen', 'Free parking', 'Pool', 'TV', 'Washer'].forEach(a => amenities.add(a));
  ['Hotel', 'Resort', 'Villa', 'Apartment', 'Cabin', 'Hostel', 'Guest house'].forEach(a => propertyTypes.add(a));
  
  const am = Array.from(amenities);
  const pt = Array.from(propertyTypes);
  
  console.log("Updating FilterSettings with:");
  console.log("Amenities:", am);
  console.log("Property Types:", pt);
  
  const FilterSettings = db.collection('filtersettings');
  await FilterSettings.updateOne({}, {
    $set: {
      amenities: am,
      propertyTypes: pt
    }
  }, { upsert: true });
  
  console.log("Success!");
  process.exit(0);
}).catch(console.error);
