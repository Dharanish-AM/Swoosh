import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

const connectToDB = async () => {
  if (!uri) {
    console.error("❌ MONGODB_URI is not defined");
    throw new Error("MONGODB_URI is not defined");
  }

  let client;

  try {
    client = await MongoClient.connect(uri);
    console.log("✅ MongoDB connected successfully");
    return client;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error("MongoDB connection failed");
  }
};

export default connectToDB;
