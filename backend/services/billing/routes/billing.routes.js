import express from "express";
import { createOrder, verifyPaymnet } from "../conntroller/billing.controller.js"
const router=express.Router()
router.post("/create",createOrder)
router.post("/verify",verifyPaymnet)
export default router