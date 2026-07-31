import Redis from "ioredis"
const redis =new Redis(process.env.REDIS_URL || process.env.Redis_URL)
redis.on("connect",()=>console.log("redis connected"))
export default redis;