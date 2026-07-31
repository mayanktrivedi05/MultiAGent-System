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
const port = process.env.PORT || 8000;
const app = express();

const AUTH_SERVICE = process.env.AUTH_SERVICE || "http://localhost:8001";
const CHAT_SERVICE = process.env.CHAT_SERVICE || "http://localhost:8002";
const AGENT_SERVICE = process.env.AGENT_SERVICE || "http://localhost:8003";
const BILLING_SERVICE = process.env.BILLING_SERVICE || "http://localhost:8004";

const rawFrontendUrl = process.env.FRONTEND_URL || "https://multi-a-gent-system.vercel.app";
const frontendOrigin = rawFrontendUrl.replace(/\/$/, "");

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin.includes("vercel.app") || origin.includes("localhost") || origin === frontendOrigin) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true
}))
app.use(morgan("dev"))
app.use(cookieParser())

const createServiceProxy = (targetUrl) => proxy(targetUrl, {
    limit: "50mb",
    timeout: 60000,
    proxyErrorHandler: (err, res, next) => {
        console.error("Gateway proxy error to", targetUrl, ":", err.message);
        return res.status(503).json({ message: "Service is starting up, please try again in a few seconds." });
    }
});

app.use('/api/auth', createServiceProxy(AUTH_SERVICE));
app.use('/api/chat', protect, proxyWithHeader(CHAT_SERVICE));
app.use('/api/agent', protect, proxyWithHeader(AGENT_SERVICE));
app.use('/api/billing', protect, proxyWithHeader(BILLING_SERVICE));
app.get("/api/me", protect, getCurrentUser)
app.get("/", (req, res) => {
    res.send("hello from gateway");
})
process.on("unhandledRejection", (reason, promise) => {
    console.error("Gateway Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
    console.error("Gateway Uncaught Exception:", err.message);
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})