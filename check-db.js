const mongoose = require('mongoose');
const { config } = require('dotenv');
config();

async function check() {
  await mongoose.connect(process.env.DATABASE_URL);
  
  // Define a loose schema just to read the raw data
  const Reservation = mongoose.models.Reservation || mongoose.model('Reservation', new mongoose.Schema({}, { strict: false }));
  
  const latest = await Reservation.findOne().sort({ createdAt: -1 }).lean();
  console.log("Latest Reservation:", latest);
  
  process.exit(0);
}

check();
