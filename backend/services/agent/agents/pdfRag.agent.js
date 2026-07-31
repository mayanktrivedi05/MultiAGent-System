import fs from "fs"
import { PDFParse } from "pdf-parse"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import { deductcredits } from "../utils/deductcredits.js"
import { getModel } from "../config/llmmodel.js"
import { vectorStore } from "../config/vectordb.js"
import { SystemMessage, HumanMessage } from "@langchain/core/messages"
import { checkLimit } from "../config/agentLimit.js"
export const pdfRag = async (state) => {

    try {
        await checkLimit(state.userId, "pdf")
        const buffer = fs.readFileSync(state.file.path)
        const pdf = new PDFParse({
            data: buffer
        })
        const result = await pdf.getText()
        const text = result.text
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 500
        })
        const docs = await splitter.createDocuments([text])
        const collectionName = `pdf-${Date.now()}`
        const store = await vectorStore(docs, collectionName)
        const relevantDocs = await store.similaritySearch(state.prompt, 5)
        const context = relevantDocs.map(doc => doc.pageContent).join("\n\n")
        const llm = await getModel("pdfRag")
        const messages = [
            new SystemMessage(
                `You are CortexAI PDF Assistant.
                Rules:
                - Answer ONLY From the uploaded PDF.
                - Never make up information.
                - If the answer is not present in the PDF, reply:
                "I couldn't find this information in the uploaded pdf."
                -Use Markdown formatting.
                `
            ),
            new HumanMessage(`
                Context:${context}
                Question:${state.prompt}`)
        ]
        const response = await llm.invoke(messages)
        const creditRes = await deductcredits(state.userId, "pdf")
        return {
            ...state,
            aiResponse: response.content,
            credits: creditRes?.credits ?? state.credits
        }
    } catch (error) {
         console.log(error)
          return {
                ...state,
                aiResponse: error?.data?.message || "failed to anlyze pdf"
            }
    }
    finally {
        if (fs.existsSync(state.file.path)) {
            fs.unlinkSync(state.file.path)
        }
    }
}