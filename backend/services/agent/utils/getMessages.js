import axios from "axios"
export const getMessages=async(conversationId)=>{
    if (!conversationId || conversationId === "undefined" || conversationId === "null") {
        return [];
    }
    try{
         const {data}=   await axios.get(`${process.env.CHAT_SERVICE_URL}/get-messages/${conversationId}`)
         return Array.isArray(data) ? data : [];
    }catch(error){
        console.log(error)
        return []
    }
}