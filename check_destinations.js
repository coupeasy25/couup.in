const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb+srv://couup25:25couuP@cluster0.tgxjmh2.mongodb.net/";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('test'); // Or whatever the db name is. Usually 'test' for mongoose if not specified in URI. Wait, mongoose uses the default DB in connection string. Let's list collections.
    const collections = await database.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    const destinations = database.collection('destinations');
    const dests = await destinations.find({}).toArray();
    console.log("Destinations:", JSON.stringify(dests, null, 2));
  } finally {
    await client.close();
  }
}

main().catch(console.error);
