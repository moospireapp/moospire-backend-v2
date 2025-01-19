declare class CacheHandler {
    private getAsync;
    private setAsync;
    private setExAsync;
    private delAsync;
    constructor();
    /**
     * Gets the value of a key from the Redis cache.
     * @param key - The key for the cached value.
     */
    getCache(key: string): Promise<string | null>;
    /**
     * Sets a key-value pair in the Redis cache.
     * @param key - The key to be stored.
     * @param value - The value to be cached.
     */
    setCache(key: string, value: string): Promise<string>;
    /**
     * Sets a key-value pair in Redis cache with an expiration time (TTL).
     * @param key - The key to be stored.
     * @param value - The value to be cached.
     * @param ttl - Time-to-live in seconds.
     */
    setCacheExp(key: string, value: string, ttl: number): Promise<string>;
    /**
     * Deletes a key from the Redis cache.
     * @param key - The key to be deleted.
     */
    delCache(key: string): Promise<number>;
}
declare const _default: CacheHandler;
export default _default;
