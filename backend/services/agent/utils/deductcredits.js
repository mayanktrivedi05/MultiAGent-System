import axios from "axios"
export const deductcredits=async(userId,agent)=>{
    try{
         const {data}=await axios.post(`${process.env.AUTH_SERVICE}/deduct-credits`,{userId,agent})
         return data
    }catch(error){
        console.log(error)
            return null
    }
}