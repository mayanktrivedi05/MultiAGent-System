import redis from "../../../shared/redis/redis.js"

const Limits = {
    chat: 20,
    search: 20,
    coding: 5,
    pdf: 5,
    ppt: 5,
    image: 10,
    vision: 10,
}

export const checkLimit = async (param1, param2) => {
    // Automatically handles both checkLimit(userId, agent) and checkLimit(agent, userId)
    let agent, userId;
    if (Limits[param1]) {
        agent = param1;
        userId = param2;
    } else {
        userId = param1;
        agent = param2;
    }

    const max = Limits[agent] || Limits["chat"]
    const key = `rate:${userId}:${agent}`
    const count = await redis.incr(key)
    
    // Ensure key expires in 60 seconds
    const currentTtl = await redis.ttl(key)
    if (count === 1 || currentTtl < 0) {
        await redis.expire(key, 60)
    }
    const ttl = await redis.ttl(key)

    if (count > max) {
        const minutes = Math.floor(ttl / 60)
        const seconds = ttl % 60
        const time = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
        const errorMessage = `⚠️ Rate limit exceeded for ${agent}. Maximum ${max} requests allowed per minute. Try again in ${time}.`
        const error = new Error(errorMessage)
        error.status = 429
        error.data = {
            success: false,
            agent,
            limit: max,
            retryAfter: time,
            remainingTime: ttl,
            message: errorMessage
        }
        throw error
    }
    return {
        remaining: max - count,
        limit: max
    }
}