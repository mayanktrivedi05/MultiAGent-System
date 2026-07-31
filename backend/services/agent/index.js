import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectdb from "./config/db.js";
import router from "./routes/agent.routes.js";


dotenv.config();
const port=process.env.PORT ;
const app=express();
app.use(express.json());
app.use("/",router)
app.use((err,req,res,next)=>{
        console.log(err)
        if(err.status){
            return res.status(err.status).json(err.data)
        }
        return res.status(500).json({message:`agent error ${err.message || err}`})
})
app.get("/", (req, res) => {
    res.send("hello from agent");
})
app.listen(port,()=>{
    console.log(`agent is running on port ${port}`);
    connectdb()
})