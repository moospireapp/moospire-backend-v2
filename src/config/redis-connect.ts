import { createClient, RedisClientType } from "redis";
import { env, appLogger } from "@/config/index.js";

// Create a typed Redis client
const redisClient: RedisClientType = createClient({
  socket: {
    host: env.REDIS_HOST as string,
    port: env.REDIS_PORT as number,
  },
});

// Function to connect to Redis database
const redisConnect = async (): Promise<void> => {
  try {
    await redisClient.connect();
    appLogger.info("Connected to RedisDB");
  } catch (err) {
    appLogger.error(`RedisDB connection error => ${err}`);
  }
};

export { redisConnect, redisClient };
