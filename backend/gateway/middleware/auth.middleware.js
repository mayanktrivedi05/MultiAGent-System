import redis from "../../shared/redis/redis.js"
const protect=async(req,res,next)=>{
    try{
        const sessionId=req.cookies?.session
        if(!sessionId){
            return res.status(401).json({message:"unauthorized"})
        }
        const session=await redis.get(`session:${sessionId}`)
        if(!session){
            return res.status(401).json({message:"session expired"})
        }
        req.user=JSON.parse(session)
        if (req.user && req.user.userId) {
            await redis.set(`user-session-${req.user.userId}`, sessionId, "EX", 60 * 60 * 24 * 7)
        }
        next()
    }catch(error){
           return res.status(500).json({message:`protect error ${error}`})
    }
}
export default protect