import redis from "../../../shared/redis/redis.js"
import { getMessages } from "../utils/getMessages.js"
export const getMemory = async (conversationId) => {
    if (!conversationId || conversationId === "undefined" || conversationId === "null") {
        return [];
    }

    const key = `messages-${conversationId}`
    const cached = await redis.get(key)
    if (cached) {
        try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (e) {
            console.error("Error parsing memory cache:", e);
        }
    }
    const messages = await getMessages(conversationId)
    const validMessages = Array.isArray(messages) ? messages : []
    await redis.set(key, JSON.stringify(validMessages), "EX", 60 * 60 * 24)
    return validMessages
}

export const addMessage = async (conversationId, role, content) => {
    if (!conversationId || conversationId === "undefined" || conversationId === "null") {
        return;
    }
    const key = `messages-${conversationId}`
    const rawMessages = await redis.get(key)
    let messages = []
    if (rawMessages) {
        try {
            const parsed = JSON.parse(rawMessages);
            if (Array.isArray(parsed)) {
                messages = parsed;
            }
        } catch (e) {
            console.error("Error parsing memory cache in addMessage:", e);
        }
    }
    messages.push({ role, content })
    if (messages.length > 20) {
        messages.shift()
    }
    await redis.set(key, JSON.stringify(messages))
}