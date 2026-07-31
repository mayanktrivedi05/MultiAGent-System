import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { getModel } from "../config/llmmodel.js";
import fs from "fs"
import { deductcredits } from "../utils/deductcredits.js" 
import { checkLimit } from "../config/agentLimit.js";
export const imageAnalyzer=async(state)=>{
    await checkLimit(state.userId,"image")
    try{
        
            const llm=await getModel("imageAnalyzer")
            const imageBuffer= fs.readFileSync(state.file.path)
            const base64image=imageBuffer.toString("base64")
            const messages=[
                new SystemMessage(
                    `You are CortexAI image analyzer agent.
                    
Rules:
- Analyze only the uploaded image.
- Answer the user's question accurately.
- If text exists in the image ,extract it.
- If charts or tables exists ,explain them.
- If something is unclear ,say so.
- use Markdown  when helpful.
- Do not hellucinate.

                    `
                ),
                new HumanMessage(
                    {
                        content:[
                          {  type:"text",
                            text:state.prompt || "analyze the image"},
                            {
                                type:"image_url",
                                "image_url":{
                                    url:`data:${state.file.mimetype};base64,${base64image}`
                                }
                            }

                          ]
                    }
                )
            ]
            const response=await llm.invoke(messages)
            const creditRes=await deductcredits(state.userId,"vision")
            return {
                ...state,
                aiResponse:response.content,
                credits: creditRes?.credits ?? state.credits
            }
    }catch(error){
          console.log(error)
          return {
                ...state,
                aiResponse: error?.data?.message || "failed to analyze image"
            }
    }
    finally{
        if (fs.existsSync(state.file.path)) {
            fs.unlinkSync(state.file.path)
        }
    }
}