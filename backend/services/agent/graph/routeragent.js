import { getModel } from "../config/llmmodel.js"

export const router=async(state)=>{
         if(state.agent && state.agent!=="auto"){
                  
       return {
        ...state,
        agent:state.agent
       }
         }
          if(state.file && state.file.mimetype==='application/pdf'){
       return {
        ...state,
        agent:"pdfRag"
       }
          }
          if(state.file && state.file.mimetype.startsWith('image/')){
       return {
        ...state,
        agent:"imageAnalyzer"
       }
          }

        const llm= await getModel("router")
        const prompt=`you are an agent router
        Available agents:

        - chat
        - search
        - coding
        - pdf
        - ppt
        - vision

        Rules:

        chat:
        General conversation,
        explanations,
        learning,
        questions,
        

        search:
        General search,
        information gathering,
        news,
        recent developments,
        internet lookup.
        
        coding:
        General coding,
        debug code,
        build projects,
        architecture
        
        pdf:
        Questions about generate PDFs
        or documnet context

        ppt:
        Questions about generate PPTs
        or ppt context

        vision:
        Generate image,
        create image
        
        Return ONLY one word:

        chat 
        search
        coding 
        pdf

        User Query:
           ${state.prompt}
        `
        const response=await llm.invoke(prompt)
        
       return {
        ...state,
        agent:response.content.trim().toLowerCase()
       }
}