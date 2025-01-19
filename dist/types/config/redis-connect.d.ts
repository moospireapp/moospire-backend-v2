import { RedisClientType } from "redis";
declare const redisClient: RedisClientType;
declare const redisConnect: () => Promise<void>;
export { redisConnect, redisClient };
