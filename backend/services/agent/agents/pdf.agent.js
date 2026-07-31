import file from "pdfkit"
import { getModel } from "../config/llmmodel.js"
import generatePDF from "../utils/generatepdf.js"
import { uploadTos3 } from "../utils/uploadTos3.js"
import { getfroms3 } from "../utils/getfroms3.js"
import { deductcredits } from "../utils/deductcredits.js"
import { checkLimit } from "../config/agentLimit.js"
export const pdfAgent = async (state) => {

    try {
        await checkLimit(state.userId, "pdf")
        const llm = await getModel("pdf")
        const prompt = `
            You are an expert document writer.

Return only valid JSON.

Do not return Markdown.

Do not return explanations.

Structure:
{
"title":"",
"subtitle":"",
"section":[
    {
        "heading":"",
        "points":[]
    }
    ]
}

Generate 4-8 sections.

Each section should have 3-6 concise bullet points.

Topic:
${state.prompt}
            `
        const res = await llm.invoke(prompt)
        const data = JSON.parse(res.content)
        const creditRes = await deductcredits(state.userId, "pdf")
        const pdfBbuffer = await generatePDF(data)
        const fileName = `pdf-${Date.now()}.pdf`
        await uploadTos3(fileName, pdfBbuffer, "application/pdf")
        const downloadUrl = await getfroms3(fileName, 60 * 24)
        return {
            ...state,
            aiResponse: `# PDF Generated
                
**${data.title}**

⬇️ [Download PDF](${downloadUrl})

_Link expires in 10 minutes
                `,
            credits: creditRes?.credits ?? state.credits
        }
    } catch (error) {
        console.log(error)
          return {
                ...state,
                aiResponse: error?.data?.message || "failed to generate pdf"
            }
    }
}