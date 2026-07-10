require('dotenv').config();
const mongoose = require('mongoose');
const mongoUri = process.env.DATABASE_URL;
mongoose.connect(mongoUri).then(async () => {
  const listing = await mongoose.connection.db.collection('listings').findOne();
  console.log("Listing ID:", listing._id.toString());
  mongoose.disconnect();
}).catch(console.error);
