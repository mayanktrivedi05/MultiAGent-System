import { getModel } from "../config/llmmodel.js"
import { generatePPt } from "../utils/generateppt.js"
import { uploadTos3 } from "../utils/uploadTos3.js"
import { getfroms3 } from "../utils/getfroms3.js"
import { deductcredits } from "../utils/deductcredits.js"
import { checkLimit } from "../config/agentLimit.js"
export const pptAgent = async (state) => {

    try {
        await checkLimit(state.userId, "ppt")
        const llm = await getModel("ppt")
        const prompt = `You are a professional presentaion designer.
        
Return only valid JSON.

Format:
{
"title":"",
"subtitle":"",
"slides":[
{
"title":"",
"points":[
"",
"",
"",
"",    
]    
}
]
}

Rules:
- Generate exactly 6 content slides.
- Each slide should have 4-6 concise bullet points.
- No markdown.
- No Explanation.
- No code block.
- Return only JSON.

Topic:
${state.prompt}
        `
        const res = await llm.invoke(prompt)
        const data = JSON.parse(res.content)
        const creditRes = await deductcredits(state.userId, "ppt")
        const ppt = await generatePPt(data)
        const buffer = await ppt.write({
            outputType: "nodebuffer"
        })
        const filename = `ppt-${Date.now()}.pptx`
        await uploadTos3(filename, buffer, "application/vnd.openxmlformats-officedocument.presentationml.presentation")
        const downloadurl = await getfroms3(filename, 24 * 60 * 60)
        return {
            ...state,
            aiResponse: `# ✅ Presentation Generated
**${data.title}**

⬇️ [Download PPT](${downloadurl})

_Link expires in 10 minutes_.
            `,
            credits: creditRes?.credits ?? state.credits
        }
    } catch (error) {
        console.log(error)
      
            return {
                ...state,
                aiResponse: error?.data?.message || "failed to generate ppt"
            }
      
       
    }
}