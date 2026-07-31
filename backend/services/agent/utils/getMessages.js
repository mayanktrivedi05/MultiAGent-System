import axios from "axios"
export const getMessages=async(conversationId)=>{
    if (!conversationId || conversationId === "undefined" || conversationId === "null") {
        return [];
    }
    try {
        const chatServiceUrl = process.env.CHAT_SERVICE_URL || "https://multiagent-chat.onrender.com";
        const { data } = await axios.get(`${chatServiceUrl}/get-messages/${conversationId}`)
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error in getMessages:", error.message || error)
        return []
    }
}