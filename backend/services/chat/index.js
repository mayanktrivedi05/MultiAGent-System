import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectdb from "./config/db.js";
import router from "./routes/chat.routes.js";

dotenv.config();
const port = process.env.PORT || 8002;
const app = express();
app.use(express.json());
app.use("/", router)
app.get("/", (req, res) => {
    res.send("hello from chat");
})

process.on("unhandledRejection", (reason, promise) => {
    console.error("Chat Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
    console.error("Chat Uncaught Exception:", err.message);
});

app.listen(port, () => {
    console.log(`chat is running on port ${port}`);
    connectdb()
})