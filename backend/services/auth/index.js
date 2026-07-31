import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectdb from "./config/db.js";
import router from "./routes/auth.route.js";

dotenv.config();
const port = process.env.PORT || 8001;
const app = express();
app.use(express.json());
app.use("/", router)
app.get("/", (req, res) => {
    res.send("hello from auth");
})

process.on("unhandledRejection", (reason, promise) => {
    console.error("Auth Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
    console.error("Auth Uncaught Exception:", err.message);
});

app.listen(port, () => {
    console.log(`auth is running on port ${port}`);
    connectdb()
})