import { getAuth } from "firebase-admin/auth"
import User from "../models/user.model.js"
import crypto from "crypto"
import app from "../config/firebase.js"
import redis from "../../../shared/redis/redis.js"
export const login = async (req, res) => {
    try {
        const { token } = req.body
        if (!token) {
            return res.status(400).json({ message: "Token is required" })
        }
        let decoded;
        try {
            if (app) {
                decoded = await getAuth(app).verifyIdToken(token)
            }
        } catch (e) {
            console.warn("Firebase Admin verifyIdToken warning, falling back to token decode:", e.message)
        }
        if (!decoded) {
            const base64Url = token.split('.')[1]
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
            const jsonPayload = Buffer.from(base64, 'base64').toString('utf8')
            decoded = JSON.parse(jsonPayload)
        }

        const uid = decoded.uid || decoded.user_id || decoded.sub;
        const name = decoded.name || decoded.email?.split('@')[0] || "User";
        const email = decoded.email;
        const avatar = decoded.picture || decoded.avatar || "";

        let user = await User.findOne({ firebaseUid: uid })
        if (!user) {
            user = await User.create({ firebaseUid: uid, name, email, avatar })
        }
        const sessionId = crypto.randomUUID()
        await redis.set(`user-session-${user?._id}`, sessionId,"EX", 60 * 60 * 24 * 7)
        await redis.set(`session:${sessionId}`, JSON.stringify({
            userId: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            plan: user.plan,
            credits: user.credits,
            totalCredits: user.totalCredits,
            planExpiresAt: user.planExpiresAt
        }), "EX", 60 * 60 * 24 * 7)
        res.cookie('session', sessionId, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24 * 7
        })
        return res.status(200).json(user)
    } catch (error) {
        console.error("Login controller error:", error);
        return res.status(500).json({ message: `login error ${error.message || error}` })
    }
}

export const logOut = async (req, res) => {
    try {
        const sessionId = req.cookies?.session
        await redis.del(`session:${sessionId}`)

        res.clearCookie("session", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })
        return res.status(200).json({ message: "logout successfully" })
    } catch (error) {
        return res.status(500).json({ message: `logout error ${error}` })
    }
}
export const updateUserPayment = async (req, res) => {
    try {
        const { plan, credits, userId } = req.body
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }
        user.plan = plan
        user.credits += credits
        user.totalCredits += credits
        user.planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        await user.save()
        const sessionId = await redis.get(`user-session-${user?._id}`)
        console.log(`DEBUG: updateUserPayment - user-session key: user-session-${user?._id}, found sessionId: ${sessionId}`)
        if (sessionId) {
            await redis.set(`session:${sessionId}`, JSON.stringify({
                userId: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                plan: user.plan,
                credits: user.credits,
                totalCredits: user.totalCredits,
                planExpiresAt: user.planExpiresAt
            }), "EX", 60 * 60 * 24 * 7)
            console.log(`DEBUG: updateUserPayment - session:${sessionId} updated successfully in Redis.`)
        } else {
            console.log(`DEBUG: updateUserPayment - No active session ID found for user ${user?._id}. Skipping Redis session update.`)
        }
        return res.status(200).json({ success: true })
    } catch (error) {
        return res.status(500).json({ message: `update user payment error ${error}` })
    }
}
export const deductcredits=async(req,res)=>{
    try{
            const {userId,agent}=req.body
            const COST={
                chat:1,
                search:5,
                coding:10,
                pdf:10,
                ppt:10,
                vision:10
            }
            const user=await User.findById(userId)
            if(!user){
                return res.status(400).json({message:"user not found"})
            }
            const requireCredits=COST[agent] || 1
            if(user.credits<requireCredits){
                return res.status(400).json({message:"not enough credits"})
            }
           user.credits-=requireCredits
           await user.save()
            const sessionId = await redis.get(`user-session-${user?._id}`)
            if (sessionId) {
                await redis.set(`session:${sessionId}`, JSON.stringify({
                    userId: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    plan: user.plan,
                    credits: user.credits,
                    totalCredits: user.totalCredits,
                    planExpiresAt: user.planExpiresAt
                }), "EX", 60 * 60 * 24 * 7)
            }
            
        return res.status(200).json({success:true,credits:user.credits})
    }catch(error){
        return res.status(500).json({message:`deduct credits error ${error}`})
    }
}