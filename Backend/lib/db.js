import {MongoClient} from "mongodb";

const client = new MongoClient(process.env.DATABASE_URL);
let db;

export const connectDB = async () => {
  if (db) return;
  try {
    await client.connect();
    db = client.db("roomconnect"); // The database name you created
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
};

export const getDB = () => db;