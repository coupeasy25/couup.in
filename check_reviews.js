require('dotenv').config();
const mongoose = require('mongoose');
const mongoUri = process.env.DATABASE_URL;
mongoose.connect(mongoUri).then(async () => {
  const reviews = await mongoose.connection.db.collection('reviews').find().sort({createdAt:-1}).limit(5).toArray();
  console.log("Recent reviews:", JSON.stringify(reviews, null, 2));
  mongoose.disconnect();
}).catch(console.error);
