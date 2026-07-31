import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import { embeddings } from "./embedding.js";
import dotenv from "dotenv";
dotenv.config();

// Node 22 fetch compatibility fix for Qdrant Cloud
if (typeof globalThis.fetch === "function") {
  const orig = globalThis.fetch;
  globalThis.fetch = (url, init) => {
    if (init) { delete init.dispatcher; delete init.onError; }
    return orig.call(globalThis, url, init);
  };
}

export const vectorStore = async (docs, collectionName) => {
  const client = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
    checkCompatibility: false
  });

  return await QdrantVectorStore.fromDocuments(docs, embeddings, { client, collectionName });
};