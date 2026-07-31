<div align="center">

  # 🤖 CortexAIAgent - Multi-Agent Autonomous AI System

  <p align="center">
    <b>A Production-Grade Microservices Architecture powering Multimodal AI Agents</b>
  </p>

  [![Vercel](https://img.shields.io/badge/Vercel-Live%20Demo-black?style=for-the-badge&logo=vercel)](https://multi-a-gent-system.vercel.app/)
  [![Docker](https://img.shields.io/badge/Docker-Microservices-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://multiagent-gateway.onrender.com)
  [![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![NodeJS](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![Redis](https://img.shields.io/badge/Redis-Upstash-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://upstash.com/)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

</div>

---

## 🌟 Overview

**CortexAIAgent** is an advanced, enterprise-ready Multi-Agent Autonomous AI platform built on a scalable **Event-Driven Microservices Architecture**. It decouples frontend operations from heavy AI workflows, leveraging LangChain, Qdrant Vector Search, and state-of-the-art LLMs (Groq, Google Gemini, OpenRouter) to deliver real-time multimodal intelligence.

## 🚀 Live Production Endpoints

| Service / Component | Hosting Platform | Deployed Live URL | Status |
| --- | --- | --- | --- |
| **Frontend Web App** | Vercel | [https://multi-a-gent-system.vercel.app/](https://multi-a-gent-system.vercel.app/) | `Live` 🟢 |
| **API Gateway** | Render | [https://multiagent-gateway.onrender.com](https://multiagent-gateway.onrender.com) | `Live` 🟢 |
| **Auth Microservice** | Render | `https://multiagent-auth.onrender.com` | `Live` 🟢 |
| **Chat Microservice** | Render | `https://multiagent-chat.onrender.com` | `Live` 🟢 |
| **AI Agent Microservice** | Render | `https://multiagent-agent.onrender.com` | `Live` 🟢 |
| **Billing Microservice** | Render | `https://multiagent-billing.onrender.com` | `Live` 🟢 |
| **Cloud Redis Database** | Upstash | `rediss://cool-piranha-73914.upstash.io` | `Live` 🟢 |

---

## 🔥 Key Features & AI Agents

### 🧠 Specialized Autonomous Agents
1. **👁️ Vision Agent:** Analyzes image inputs, detects objects, and performs optical reasoning using vision LLMs.
2. **📄 PDF RAG Agent:** Implements Retrieval-Augmented Generation over uploaded PDF documents via **Qdrant Vector Database**.
3. **🌐 Web Search Agent:** Real-time web search and live internet grounding using Tavily AI API.
4. **📊 PPT Generator Agent:** Automatically crafts structured presentation decks based on user prompts.
5. **💻 Coding Assistant:** Writes, refactors, and debugs code across multiple programming languages.

### ⚙️ System Capabilities
- **Decoupled Microservices:** API Gateway routing requests to 4 independent backend microservices.
- **Low-Latency Session Caching:** Powered by **Upstash Redis** for fast multi-turn conversation memory recovery.
- **Fail-Safe Auth & Payments:** Firebase Authentication + Razorpay Payment Gateway integration with dynamic user credit deduction.
- **Full Containerization:** Dockerized services with single-command `docker compose` deployment.

---

## 🏗 System Architecture

```mermaid
graph TD
    Client["🌐 Frontend (React + Vite SPA on Vercel)"] -->|HTTPS / Cookies| Gateway["⚡ API Gateway (Express Proxy - Port 8000)"]
    
    Gateway -->|/api/auth| Auth["🔐 Auth Service (Port 8001)"]
    Gateway -->|/api/chat| Chat["💬 Chat Service (Port 8002)"]
    Gateway -->|/api/agent| Agent["🤖 Agent Service (Port 8003)"]
    Gateway -->|/api/billing| Billing["💳 Billing Service (Port 8004)"]

    Agent -->|RAG Vector Search| Qdrant["🔍 Qdrant Vector DB"]
    Agent -->|File Storage| S3["📁 AWS S3 Bucket"]
    Agent -->|LLM Queries| LLM["🧠 LLMs (Groq / Gemini / OpenRouter)"]
    
    Auth & Chat & Agent & Billing -->|Pub/Sub & Caching| Redis[("⚡ Upstash Redis")]
    Auth & Chat & Billing -->|Persistent Data| Mongo[("🍃 MongoDB Atlas")]
```

---

## 🛠 Tech Stack

| Domain | Technologies |
| --- | --- |
| **Frontend** | React 19, Vite, Redux Toolkit, TailwindCSS, Monaco Editor, Motion, Lucide Icons |
| **Backend & Microservices** | Node.js, Express.js, Express HTTP Proxy, Morgan, Cookie-Parser |
| **Databases & Cache** | MongoDB Atlas, Qdrant Cloud Vector DB, Upstash Redis |
| **AI Framework & APIs** | LangGraph, LangChain, Groq API, Google Gemini AI, OpenRouter, Tavily Web Search |
| **Storage & Auth** | AWS S3 (SDK v3), Firebase Authentication, Razorpay Payments |
| **DevOps & Infrastructure** | Docker, Docker Compose, Nginx Reverse Proxy, Vercel, Render PaaS |

---

## 📁 Repository Structure

```text
MultiAgentSystem/
├── frontend/                # React 19 + Vite Web Application
│   ├── public/              # Icons, Favicons, Static Assets
│   ├── src/                 # Redux Slices, UI Components, Pages
│   └── utils/               # Axios Client Configuration
├── backend/                 # Microservices Core
│   ├── gateway/             # Central API Proxy Gateway (Port 8000)
│   ├── shared/              # Shared Redis & Database Utilities
│   └── services/            # Decoupled Services
│       ├── agent/           # LangChain AI Graph Agents (Vision, RAG, PPT, Search)
│       ├── auth/            # Firebase User Auth & Credits Manager
│       ├── chat/            # Conversation History & Message Store
│       └── billing/         # Razorpay Orders & Subscription Handling
├── docker-compose.yml       # Production Multi-Container Manifest
├── DEPLOYMENT.md            # Comprehensive Production Deployment Manual
└── README.md                # System Documentation
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- [Node.js v18+](https://nodejs.org/)
- [Docker & Docker Compose](https://www.docker.com/)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/MultiAgentSystem.git
cd MultiAgentSystem
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in the root and fill in your keys:
```bash
cp .env.example .env
```

### 3. Run via Docker Compose (Recommended)
Launch all 5 microservices and Redis simultaneously:
```bash
docker compose up -d --build
```
Check running services:
```bash
docker compose ps
```

### 4. Run Frontend Locally
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser!

---

## 🔐 Environment Variables Reference

```env
# Server Config
FRONTEND_URL=https://multi-a-gent-system.vercel.app

# Database & Cache
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/agent
REDIS_URL=rediss://default:<password>@cluster.upstash.io:6379

# AI & LLM Keys
GROQ_API_KEY=gsk_...
GOOGLE_API_KEY=AQ....
OPENROUTER_API_KEY=sk-or-v1-...
TAVILY_API_KEY=tvly-...

# Vector DB & Storage
QDRANT_URL=https://<cluster-id>.qdrant.io
QDRANT_API_KEY=eyJhbGci...
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_KEY=...
AWS_BUCKET_NAME=cortex-ai-agent

# Payments & Auth
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an Issue or submit a Pull Request to enhance AI Agents, add vector index strategies, or optimize service pipelines.

---

<div align="center">
  Crafted with ❤️ by <b>Mayank Trivedi</b>
</div>
