import { createClient } from "redis";
import { env, appLogger } from "../config/index.js";
// Create a typed Redis client
const redisClient = createClient({
    socket: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
    },
});
// Function to connect to Redis database
const redisConnect = async () => {
    try {
        await redisClient.connect();
        appLogger.info("Connected to RedisDB");
    }
    catch (err) {
        appLogger.error(`RedisDB connection error => ${err}`);
    }
};
export { redisConnect, redisClient };
//# sourceMappingURL=redis-connect.js.map