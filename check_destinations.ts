import { config } from "dotenv";
config();

import { connectToDatabase } from "./src/lib/mongodb";
import Destination from "./src/models/Destination";

async function main() {
  await connectToDatabase();
  const dests = await Destination.find().lean();
  console.log(JSON.stringify(dests, null, 2));
  process.exit(0);
}
main();
