import api from "../../utils/axios"
const getCurrentUser=async(req,res)=>{
    try{
        const {data}=await api.get("/api/me")
        return data
    }catch(error){
        console.log(error)
            return null
    }
}
export default getCurrentUser