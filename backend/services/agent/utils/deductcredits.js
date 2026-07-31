import axios from "axios"
export const deductcredits = async (userId, agent) => {
    try {
        const authServiceUrl = process.env.AUTH_SERVICE || "https://multiagent-auth.onrender.com";
        const { data } = await axios.post(`${authServiceUrl}/deduct-credits`, { userId, agent })
        return data
    } catch (error) {
        console.error("Error in deductcredits:", error.message || error)
        return null
    }
}