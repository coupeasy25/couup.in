import mongoose from "mongoose";
import axios from "axios";
import { Reservation } from "./src/models/Reservation.ts";

async function testEmail() {
  await mongoose.connect(process.env.DATABASE_URL || "mongodb+srv://couup25:25couuP@cluster0.tgxjmh2.mongodb.net/");
  const latestRes = await mongoose.connection.collection("reservations").find().sort({createdAt: -1}).limit(1).toArray();
  
  if (latestRes.length === 0) {
    console.log("No reservations found");
    process.exit(0);
  }

  const resId = latestRes[0]._id.toString();
  console.log("Found reservation:", resId);
  
  try {
    const res = await axios.post("http://localhost:3000/api/reservations/send-email", { reservationId: resId });
    console.log("Success:", res.data);
  } catch (e) {
    console.error("Error triggering email:", e?.response?.data || e.message);
  }
  process.exit(0);
}

testEmail();
