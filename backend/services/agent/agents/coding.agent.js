import { checkLimit } from "../config/agentLimit.js"
import { getModel } from "../config/llmmodel.js"
import { deductcredits } from "../utils/deductcredits.js"
export const codingAgent = async (state) => {
   try{
      await checkLimit(state.userId,"coding")
   const intentLlm = await getModel("intent")
   const llm = await getModel("coding")
   const intentRes = await intentLlm.invoke(
      `You are an intent classifier.
Return only one of these values.

CODE_GENERATION
CODE_REVIEW
CODE_EXPLANATION
DEBUGGING
OPTIMIZATION
CONVERSION 
DOCUMNETATION

User Request:
${state.prompt}
    `
   )
   const intent = intentRes.content
   if (intent == "CODE_GENERATION") {
      const prompt = `
     You are CortexAI Coding Agent.

     Generate the requested project.

     Default stack:
     - HTML
     - CSS
     - JAVASCRIPT
    Use React /Next.js/Vue ONLY if explicitly requested.

    Rules:
     - Responsive
     - Modern UI
     - CSS Variables
     - Flexbox/Grid
     - Smooth Scroll
     - Hover Effects
     - Beautiful Spacing
     - Single page unless user ask otherwise 

     IMAGES
     ===========================

     Always use real Unsplash images.
     Never use placeholders.

     Return only valid JSON

     Schema:
      {
         "files":[
         {
         "name":"index.html",
         "content":"..."
         },
         {
         "name":"style.css",
         "content":"..."
         },
         {
         "name":"script.js",
         "content":"..."
         
         }
         ]
     
     
     
      }
Rules:
- Output must start with {
- Output must end with }
- No markdown
- No explanation
- No extra text
- No \`\`\`
- Never mention intent 

User Request:
${state.prompt}



     `
      const res = await llm.invoke(prompt)
      const data = JSON.parse(res.content)
      const creditRes = await deductcredits(state.userId, "coding")
      return {
         ...state,
         aiResponse: "Code Generated Successfully",
         artifacts: [
            {
               id: Date.now(),
               type: "Project",

               files: data.files || [],
               title: state.prompt
            }
         ],
         credits: creditRes?.credits ?? state.credits
      }
   }
   const res = await llm.invoke(`
    The User's request is:${intent}
    Return Markdown only
    Never Generate Project files.

    Use heading likes:
    # Overflow
    ## Explanation
    ## Problems
    ## Improvements
    ## Best Practices
    ## Optimized Code (if needed)
    User Request:
    ${state.prompt}

    `)
   const data = res.content
   const creditRes = await deductcredits(state.userId, "coding")
   return {
      ...state,
      aiResponse: data,
      artifacts: [],
      credits: creditRes?.credits ?? state.credits
   }
   }catch(error){
        console.log(error)
          return {
                ...state,
                aiResponse: error?.data?.message || "failed to generate code",
                artifacts: [],
              
            }
   }
    
}