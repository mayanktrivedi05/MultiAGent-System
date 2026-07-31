import { TavilySearch } from "@langchain/tavily";
import dotenv from "dotenv";
dotenv.config();
export const searchtool = new TavilySearch({
  maxResults: 5,
  topic: "general",
  apiKey: process.env.TAVILY_API_KEY,
  includeImages: true,
});