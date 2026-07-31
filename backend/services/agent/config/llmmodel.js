import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatOpenRouter } from "@langchain/openrouter";
import dotenv from 'dotenv'
dotenv.config()
const groq = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    apiKey: process.env.GROQ_API_KEY,

})
const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GOOGLE_API_KEY,
})
const openrouter = new ChatOpenRouter({
    model: "deepseek/deepseek-chat",
    temperature: 0,
    maxTokens: 8000,
    apiKey: process.env.OPENROUTER_API_KEY
})
export const getModel = async (agent) => {
    switch (agent) {
        case "chat":
            return groq
        case "search":
            return groq
        case "coding":
            return openrouter
        case "imageAnalyzer":
            return gemini
        default:
            return groq
    }
}