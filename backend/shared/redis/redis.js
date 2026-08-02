import Redis from "ioredis"

const redisUrl = process.env.REDIS_URL || process.env.Redis_URL

const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    connectTimeout: 10000,
    commandTimeout: 5000,
    retryStrategy(times) {
        const delay = Math.min(times * 200, 3000)
        return delay
    },
    tls: redisUrl?.startsWith("rediss://") ? { rejectUnauthorized: false } : undefined
})

redis.on("connect", () => console.log("redis connected"))
redis.on("error", (err) => console.error("redis error:", err.message))

export default redis;