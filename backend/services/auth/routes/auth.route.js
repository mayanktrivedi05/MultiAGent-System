import express from "express";
import { login, logOut, updateUserPayment, deductcredits } from "../controllers/auth.controller.js";
const router=express.Router();
router.post("/login",login)
router.post("/logout",logOut)
router.post("/update-plan",updateUserPayment)
router.post("/deduct-credits",deductcredits)
export default router