const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.DATABASE_URL;

const amenitiesToSeed = [
  // Very popular (Quick Filters)
  { name: "Wifi", isQuickFilter: true, isActive: true },
  { name: "Pool", isQuickFilter: true, isActive: true },
  { name: "Kitchen", isQuickFilter: true, isActive: true },
  { name: "Air conditioning", isQuickFilter: true, isActive: true },
  { name: "Free parking", isQuickFilter: true, isActive: true },
  { name: "TV", isQuickFilter: true, isActive: true },
  { name: "Washing machine", isQuickFilter: true, isActive: true },

  // Standard (Only in Popup)
  { name: "Dedicated workspace", isQuickFilter: false, isActive: true },
  { name: "Hair dryer", isQuickFilter: false, isActive: true },
  { name: "Iron", isQuickFilter: false, isActive: true },
  { name: "Hot tub", isQuickFilter: false, isActive: true },
  { name: "EV charger", isQuickFilter: false, isActive: true },
  { name: "Cot", isQuickFilter: false, isActive: true },
  { name: "Gym", isQuickFilter: false, isActive: true },
  { name: "BBQ grill", isQuickFilter: false, isActive: true },
  { name: "Breakfast", isQuickFilter: false, isActive: true },
  { name: "Indoor fireplace", isQuickFilter: false, isActive: true },
  { name: "Smoking allowed", isQuickFilter: false, isActive: true },
  { name: "Beachfront", isQuickFilter: false, isActive: true },
  { name: "Waterfront", isQuickFilter: false, isActive: true },
  { name: "Ski-in/ski-out", isQuickFilter: false, isActive: true },
  { name: "Smoke alarm", isQuickFilter: false, isActive: true },
  { name: "Carbon monoxide alarm", isQuickFilter: false, isActive: true },
  { name: "Self check-in", isQuickFilter: false, isActive: true },
];

async function seed() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB.");

    const db = client.db("test"); // Mongoose uses test by default if not specified in URI, or the URI's db name
    const amenitiesCollection = db.collection("amenities");

    // Get current amenities to avoid duplicates
    const existing = await amenitiesCollection.find({}).toArray();
    const existingNames = new Set(existing.map((a) => a.name));

    const toInsert = amenitiesToSeed.filter((a) => !existingNames.has(a.name));

    if (toInsert.length > 0) {
      // Add createdAt and updatedAt
      const now = new Date();
      toInsert.forEach((a) => {
        a.createdAt = now;
        a.updatedAt = now;
      });

      const result = await amenitiesCollection.insertMany(toInsert);
      console.log(`Successfully seeded ${result.insertedCount} amenities.`);
    } else {
      console.log("No new amenities to seed, all exist.");
    }
  } catch (error) {
    console.error("Error seeding amenities:", error);
  } finally {
    await client.close();
  }
}

seed();
