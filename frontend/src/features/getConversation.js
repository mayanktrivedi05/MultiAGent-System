import api from "../../utils/axios"
export const getConversation = async () => {
    try {
        const { data } = await api.get("/api/chat/get-conversations")
        return data
    } catch (error) {
        if (error?.response?.status !== 401) {
            console.error("getConversation error:", error)
        }
        return []
    }
}