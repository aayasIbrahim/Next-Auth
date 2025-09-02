import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;
if (!MONGO_URI) throw new Error("Please define MONGO_URI in .env");

// Extend globalThis to include mongoose caching
declare global {
  var _mongo: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

// Initialize global cache
global._mongo = global._mongo || { conn: null, promise: null };

async function connectDB() {
  if (global._mongo.conn) return global._mongo.conn;

  if (!global._mongo.promise) {
    global._mongo.promise = mongoose.connect(MONGO_URI).then((mongoose) => mongoose);
  }

  global._mongo.conn = await global._mongo.promise;
  return global._mongo.conn;
}

export default connectDB;
