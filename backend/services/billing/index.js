import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectdb from "./config/db.js";

import router from "./routes/billing.routes.js";
dotenv.config();
const port = process.env.PORT || 8004;
const app = express();
app.use(express.json());
app.use("/", router)
app.get("/", (req, res) => {
    res.send("hello from billing");
})

process.on("unhandledRejection", (reason, promise) => {
    console.error("Billing Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
    console.error("Billing Uncaught Exception:", err.message);
});

app.listen(port, () => {
    console.log(`billing is running on port ${port}`);
    connectdb()
})