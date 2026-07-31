import { checkLimit } from "../config/agentLimit.js"
import { searchtool } from "../config/tavily.js"
import { deductcredits } from "../utils/deductcredits.js"
export const searchAgent = async (state) => {

    try {
            await checkLimit(state.userId,"search")
        const results = await searchtool.invoke({
            query: state.prompt
        })
        const creditRes = await deductcredits(state.userId, "search")
        console.log(results)
        return {
            ...state,
            searchResults: results,
            images: results.images,
            credits: creditRes?.credits ?? state.credits
        }
    } catch (error) {
         console.log(error)
          return {
                ...state,
                searchResults: [],
                aiResponse: error?.data?.message || "failed to search result",
                images: [],
            }
    }
}