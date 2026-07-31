import redis from "../../../shared/redis/redis.js"
import { addMessage } from "../config/momory.js"
import { graph } from "../graph/graph.js"
import axios from "axios"

export const agent = async (req, res,next) => {
    try {
        const { prompt, conversationId, agent } = req.body
        const file = req.file
        console.log("file", file    )
        const userId = req.headers["x-user-id"]
        await axios.post(`${process.env.CHAT_SERVICE_URL}/save-message`, { conversationId, role: "user", content: prompt })
        const result = await graph.invoke({ prompt, conversationId, agent, userId, file })
        console.log(result)
        await addMessage(conversationId, "user", prompt)
        await addMessage(conversationId, "assistant", result.aiResponse)
        await axios.post(`${process.env.CHAT_SERVICE_URL}/save-message`, { conversationId, role: "assistant", content: result.aiResponse, images: result.images, artifacts: result?.artifacts })
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