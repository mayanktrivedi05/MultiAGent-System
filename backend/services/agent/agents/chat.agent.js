import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages"
import { getModel } from "../config/llmmodel.js"
import { getMemory } from "../config/momory.js"
import { deductcredits } from "../utils/deductcredits.js"
import { checkLimit } from "../config/agentLimit.js"

export const chatAgent = async (state) => {
    try {
        await checkLimit(state.userId, "chat")
        const llm = await getModel("chat")
        const history = await getMemory(state.conversationId)
        const searchContext = state.searchResults ? `Web Search Results:
    
    ${JSON.stringify(state.searchResults)} 
    Answer the user using only the above search results.
    `: ""
        const systemprompt = `you are cortex ai ,an intelligent ai assistant

    ${searchContext}
    If searchContext exists:
    - Use Search result to answer.
    - Do not mention internal tools.
    Rules:
    - For simple Questions ,greeting and short queries ,respond naturally in plain text.
    - For Technical ,educational,coding or detailed topics ,use clean Markdown.
    Formatting:
    - Use # for titles and ## for sections.
    - Leave a blank line after headings.
    - Use bullet points for lists.
    - use numbered lists for steps.
    - use fenced code blocks with language tags for code.
    - keep paragraphs short and readable.
    - Never write headings and content on the same line.
    - never generate large walls of text.
    `
        const messages = [
            new SystemMessage(systemprompt)
        ]

        history.forEach(msg => {
            if (!msg.content) return
            if (msg.role == "user") {
                messages.push(new HumanMessage(msg.content))
            }
            if (msg.role == "assistant") {
                messages.push(new AIMessage(msg.content))
            }
        });

        messages.push(new HumanMessage(state.prompt))
        console.log(messages)


        const response = await llm.invoke(messages)
        const creditRes = await deductcredits(state.userId, "chat")
        return {
            ...state,
            aiResponse: response.content,
            credits: creditRes?.credits ?? state.credits
        }
    } catch (error) {
        return {
                ...state,
                aiResponse: error?.data?.message || "failed to generate chat"
            }

    }


}