import express from "express";
import dotenv from "dotenv";
import  proxy  from "express-http-proxy";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import protect from "./middleware/auth.middleware.js";
import getCurrentUser  from "./controller/user.controller.js";
import {proxyWithHeader} from "./utils/proxywithheader.js";

dotenv.config();
const port=process.env.PORT ;
const app=express();
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))
app.use(morgan("dev"))
app.use(cookieParser())
app.use('/api/auth',proxy(process.env.AUTH_SERVICE));
app.use('/api/chat',protect,proxyWithHeader(process.env.CHAT_SERVICE));
app.use('/api/agent',protect,proxyWithHeader(process.env.AGENT_SERVICE));
app.use('/api/billing',protect,proxyWithHeader(process.env.BILLING_SERVICE));
app.get("/api/me",protect,getCurrentUser)
app.get("/", (req, res) => {
    res.send("hello from gateway");
})
app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})