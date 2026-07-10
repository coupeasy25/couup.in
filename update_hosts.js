const mongoose = require('mongoose');

async function updateHosts() {
  try {
    await mongoose.connect('mongodb+srv://coupeasy25_db_user:25couuP25@cluster0.tgxjmh2.mongodb.net/test'); // Adjusting db name if needed, assuming default test or couup. Wait, the URI has no db name, I'll use the default one used by the app.
    
    // Let's use the mongoose models or just plain collections
    const listings = await mongoose.connection.collection('listings').find({ status: 'APPROVED' }).toArray();
    console.log(`Found ${listings.length} approved listings.`);
    
    const userIds = [...new Set(listings.map(l => l.userId.toString()))];
    console.log(`Found ${userIds.length} unique hosts to update.`);
    
    for (const id of userIds) {
      await mongoose.connection.collection('users').updateOne(
        { _id: new mongoose.Types.ObjectId(id) },
        { $set: { isHost: true } }
      );
    }
    console.log("Finished updating users.");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
}
updateHosts();
