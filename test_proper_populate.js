require('dotenv').config();
const mongoose = require('mongoose');
const mongoUri = process.env.DATABASE_URL;

mongoose.connect(mongoUri).then(async () => {
  require('ts-node').register({ transpileOnly: true });
  const { Listing } = require('./src/models/Listing');
  const { User } = require('./src/models/User'); // ensure User model is loaded
  
  let listing1 = await Listing.findById("6a423f07221a15c6a8cd4857").populate('userId');
  console.log("Listing 1 populated:", !!listing1);
  
  mongoose.disconnect();
}).catch(console.error);
