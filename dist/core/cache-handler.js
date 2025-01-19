import { promisify } from "util";
import { appLogger, redisClient } from "../config/index.js";
class CacheHandler {
    getAsync;
    setAsync;
    setExAsync;
    delAsync;
    constructor() {
        this.getAsync = promisify(redisClient.get).bind(redisClient);
        this.setAsync = promisify(redisClient.set).bind(redisClient);
        this.setExAsync = promisify(redisClient.setEx).bind(redisClient);
        this.delAsync = promisify(redisClient.del).bind(redisClient);
    }
    /**
     * Gets the value of a key from the Redis cache.
     * @param key - The key for the cached value.
     */
    async getCache(key) {
        try {
            const result = await this.getAsync(key);
            console.log("Result", result);
            return result;
        }
        catch (err) {
            appLogger.error(`Unable to get ${key} from Redis cache: ${err}`);
            throw err;
        }
    }
    /**
     * Sets a key-value pair in the Redis cache.
     * @param key - The key to be stored.
     * @param value - The value to be cached.
     */
    async setCache(key, value) {
        try {
            const result = await this.setAsync(key, value);
            return result;
        }
        catch (err) {
            appLogger.error(`Unable to set ${key} in Redis cache: ${err}`);
            throw err;
        }
    }
    /**
     * Sets a key-value pair in Redis cache with an expiration time (TTL).
     * @param key - The key to be stored.
     * @param value - The value to be cached.
     * @param ttl - Time-to-live in seconds.
     */
    async setCacheExp(key, value, ttl) {
        try {
            const result = await this.setExAsync(key, ttl, value);
            return result;
        }
        catch (err) {
            appLogger.error(`Unable to set ${key} in Redis cache with TTL: ${err}`);
            throw err;
        }
    }
    /**
     * Deletes a key from the Redis cache.
     * @param key - The key to be deleted.
     */
    async delCache(key) {
        try {
            const result = await this.delAsync(key);
            return result;
        }
        catch (err) {
            appLogger.error(`Unable to delete ${key} from Redis cache: ${err}`);
            throw err;
        }
    }
}
export default new CacheHandler();
//# sourceMappingURL=cache-handler.js.map