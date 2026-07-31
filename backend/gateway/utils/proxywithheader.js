import proxy from "express-http-proxy";
export const proxyWithHeader = (serviceUrl) => {
    return proxy(serviceUrl, {
        limit: "50mb",
        timeout: 60000,
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            if (srcReq.user) {
                proxyReqOpts.headers["x-user-id"] = srcReq.user.userId
            }
            return proxyReqOpts;
        },
        proxyErrorHandler: (err, res, next) => {
            console.error("Proxy error to", serviceUrl, ":", err.message);
            return res.status(503).json({ message: "Service is starting up, please try again in a few seconds." });
        }
    });
}