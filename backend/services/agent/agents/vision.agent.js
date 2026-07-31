import { getModel } from "../config/llmmodel.js"
import axios from "axios"
import { uploadTos3 } from "../utils/uploadTos3.js"
import { getfroms3 } from "../utils/getfroms3.js"
import { deductcredits } from "../utils/deductcredits.js"
import { checkLimit } from "../config/agentLimit.js"
 
export const visionAgent = async (state) => {

    try {
            await checkLimit(state.userId,"image")
        const llm = await getModel("image")
        const res = await llm.invoke(`
        You are an elite AI Image prompt engineer.
Convert the user request into a highly detailed image generation prompt.
Requirements:
- Cinematic lighting
- Professional composition
- Ultra Realistic
- High Detail 
- Beautiful colour palette
- Sharp Focus
- 8K Quality
- Photorealistic
- Depth of field
- Professional photography
- Stunning visuals

Return only the image prompt.

User Request:
${state.prompt}
        
        `)
        const prompt = res.content.trim()
        const imgurl = `http://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`
        const imageRes = await axios.get(imgurl, { responseType: "arraybuffer" })
        const creditRes = await deductcredits(state.userId, "vision")
        const buffer = Buffer.from(imageRes.data)
        const filename = `image-${Date.now()}.png`
        await uploadTos3(filename, buffer, "image/png")
        const downloadurl = await getfroms3(filename, 60 * 24)
        return {
            ...state,
            aiResponse:
                `🏞️ Image Generated Succesfully

![Generated Image](${downloadurl})

 ⬇️ [Download Image] (${downloadurl})

   ⏳ Link Expire in 10 minutes
    `,
            credits: creditRes?.credits ?? state.credits
        }
    } catch (error) {
          console.log(error)
          return {
                ...state,
                aiResponse: error?.data?.message || "failed to generate image"
            }
    }

}