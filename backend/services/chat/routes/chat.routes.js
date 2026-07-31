import express from "express";
import { createConversation, getConversations, updateConversation,saveMessage,getMessages } from "../controller/chat.controller.js";
const router=express.Router();
router.post("/create-conversations",createConversation)
router.get("/get-conversations",getConversations)
router.post("/update-conversation",updateConversation)
router.post("/save-message",saveMessage)
router.get("/get-messages/:conversationId",getMessages)
export default router