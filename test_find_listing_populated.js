require('dotenv').config();
const mongoose = require('mongoose');
const mongoUri = process.env.DATABASE_URL;

mongoose.connect(mongoUri).then(async () => {
  const Listing = mongoose.models.Listing || mongoose.model('Listing', new mongoose.Schema({}, { strict: false }));
  const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }));
  
  let listing1 = await Listing.findById("6a423f07221a15c6a8cd4857").populate('userId');
  console.log("Listing 1 populated:", !!listing1);
  
  let listing2 = await Listing.findById("6a3888bb0e4d846da27812d2").populate('userId');
  console.log("Listing 2 populated:", !!listing2);
  
  mongoose.disconnect();
}).catch(console.error);
