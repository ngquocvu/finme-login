import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

async function connect() {
  const mongoDb = await MongoMemoryServer.create();
  const getUri = mongoDb.getUri();
  mongoose.set("strictQuery", true);

  const db = await mongoose.connect(getUri);
  console.log("backend");
  return db;
}

export default connect;
