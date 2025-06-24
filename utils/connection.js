
import { createClient } from "redis";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

let redisClient;
let mongoClient;
let mongoDB;

async function connectAll(db_name) {
  if (!redisClient) {
    redisClient = createClient({
      username: process.env.REDIS_USERNAME || undefined,
      password: process.env.REDIS_PASSWORD || undefined,
      socket: {
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT || 6379),
      },
    });

    redisClient.on("error", (err) => console.error("Redis Client Error:", err));
    console.log("✅ Redis connected");
    await redisClient.connect();
  }

  if (!mongoClient) {
    mongoClient = new MongoClient(
      process.env.MONGO_URL || undefined,
      
    );
    await mongoClient.connect();
    console.log("✅ MongoDB connected");
    mongoDB = mongoClient.db(db_name);
  }
  console.log(mongoDB);

  return { redisClient, mongoClient,mongoDB };
}



export { connectAll };
