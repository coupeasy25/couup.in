
const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb+srv://couup25:25couuP@cluster0.tgxjmh2.mongodb.net/";
  const client = new MongoClient(uri);

  const images = {
    "Ahmedabad": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sabarmati_Riverfront_2.jpg/800px-Sabarmati_Riverfront_2.jpg",
    "Diu": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Diu_Fort%2C_Diu.jpg/800px-Diu_Fort%2C_Diu.jpg",
    "Vadodara": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Lakshmi_Vilas_Palace_-_Vadodara.jpg/800px-Lakshmi_Vilas_Palace_-_Vadodara.jpg",
    "Saputara": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Saputara_Lake.jpg/800px-Saputara_Lake.jpg",
    "Dwarka": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Dwarkadhish_Temple%2C_Dwarka.jpg/800px-Dwarkadhish_Temple%2C_Dwarka.jpg"
  };

  try {
    await client.connect();
    const database = client.db('test');
    const destinations = database.collection('destinations');
    
    for (const [name, imageSrc] of Object.entries(images)) {
      await destinations.updateOne({ name: name }, { $set: { imageSrc: imageSrc } });
      console.log(`Updated ${name} with new image URL.`);
    }
    
    console.log("Successfully updated all destinations.");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
