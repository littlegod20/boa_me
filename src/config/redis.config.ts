import Redis from "ioredis";
import { logger } from "./logger.config";

let redis: Redis

export const connectRedis = async () => {
    try {
        redis = new Redis(process.env.REDIS_URL!)
        await redis.ping()
        logger.info('Redis connected successfully')
    } catch (error) {
        logger.error('Redis connection error', {error})
        process.exit(1)
    }
}

export const getRedis = () => {
    if (!redis) throw new Error('Redis not connected')
    return redis
}