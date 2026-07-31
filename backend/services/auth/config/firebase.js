
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";
import path from "path";

let credential;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
    }
    credential = cert(serviceAccount);
  } catch (err) {
    console.error("Error parsing FIREBASE_SERVICE_ACCOUNT env var:", err);
  }
}

if (!credential) {
  const keyPath = path.resolve("./serviceAccountKey.json");
  if (fs.existsSync(keyPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));
    credential = cert(serviceAccount);
  } else {
    console.warn("Warning: serviceAccountKey.json not found and FIREBASE_SERVICE_ACCOUNT not set.");
  }
}

const app = credential ? initializeApp({ credential }) : null;

export const adminAuth = app ? getAuth(app) : null;
export default app;
