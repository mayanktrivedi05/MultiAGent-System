import razorpay from "../config/razorpay.js"
import { PLANS } from "../config/plan.js"
import Payment from "../model/payment.model.js"
import crypto from "crypto"
import dotenv from "dotenv"
import axios from "axios"
dotenv.config()
export const createOrder=async(req,res)=>{
    try{
        const {plan}=req.body
        const userId=req.headers["x-user-id"]
        const selectedPlans=PLANS[plan]

        if(!selectedPlans){
            return res.status(400).json({message:"plan not found"})
        }
        const order=await razorpay.orders.create({
            amount:selectedPlans.amount*100,
            currency:"INR",
            receipt:`receipt-${Date.now()}`,
        })
        await Payment.create({
            userId,
            orderId:order.id,
            amount:selectedPlans.amount,
            credits:selectedPlans.credits,
            plan:selectedPlans.id,
            currency:order.currency,
            status:"created"
        })
        return res.status(200).json({order,plan:selectedPlans})
    }catch(error){
            return res.status(500).json({message:`create order error ${error}`})
    }
}

export const verifyPaymnet=async(req,res)=>{
    try{
        const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body
        const generatesingnature=crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex")
        if(generatesingnature!==razorpay_signature){
            return res.status(400).json({message:"payment verification failed"})
        }
        const payment=await Payment.findOne({orderId:razorpay_order_id})
        if(!payment)
        {
            return res.status(404).json({message:"payment not found"})
        }
        payment.status="paid"
        payment.paymentId=razorpay_payment_id
        await payment.save()
        const authServiceUrl = process.env.AUTH_SERVICE || "https://multiagent-auth.onrender.com";
        await axios.post(`${authServiceUrl}/update-plan`,{userId:payment.userId,credits:payment.credits,plan:payment.plan})
        return res.status(200).json({message:"payment verified successfully"})
    }
    catch(error){
        return res.status(500).json({message:`verify payment error ${error}`})
    }
}