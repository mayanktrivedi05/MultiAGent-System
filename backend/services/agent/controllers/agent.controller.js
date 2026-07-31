import redis from "../../../shared/redis/redis.js"
import { addMessage } from "../config/momory.js"
import { graph } from "../graph/graph.js"
import axios from "axios"

export const agent = async (req, res, next) => {
    try {
        const { prompt, conversationId, agent } = req.body
        const file = req.file
        const userId = req.headers["x-user-id"]
        const chatServiceUrl = process.env.CHAT_SERVICE_URL || "https://multiagent-chat.onrender.com";
        try {
            await axios.post(`${chatServiceUrl}/save-message`, { conversationId, role: "user", content: prompt })
        } catch (e) {
            console.error("Error saving user message to chat service:", e.message);
        }
        const result = await graph.invoke({ prompt, conversationId, agent, userId, file })
        console.log(result)
        await addMessage(conversationId, "user", prompt)
        await addMessage(conversationId, "assistant", result.aiResponse)
        try {
            await axios.post(`${chatServiceUrl}/save-message`, { conversationId, role: "assistant", content: result.aiResponse, images: result.images, artifacts: result?.artifacts })
        } catch (e) {
            console.error("Error saving assistant message to chat service:", e.message);
        }
        return res.status(200).json({
            answer: result?.aiResponse,
            images: result?.images,
            artifacts: result?.artifacts,
            credits: result?.credits
        })
    } catch (error) {
        next(error)
    }
}