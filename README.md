# 🍳 SavoryAI - AI-Powered Recipe Finder & Meal Planner

An intelligent, full-stack culinary assistant built with **React + Vite**, **Express.js**, **MongoDB**, and **Groq Cloud AI**.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js** v18 or higher ([Download Node.js](https://nodejs.org/))
- **MongoDB** (Local instance or free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- **Groq API Key** (Free from [Groq Cloud Console](https://console.groq.com/keys))

### 2. Environment Setup
Create a `.env` file inside the `server/` directory:
```bash
cp server/.env.example server/.env
```
Populate `server/.env` with your credentials:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/recipe_finder
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=qwen/qwen3.6-27b
JWT_SECRET=your_jwt_secret_key_change_in_production
CLIENT_URL=http://localhost:5173
```

### 3. Install Dependencies & Run
From the root directory:
```bash
# Install both backend and frontend dependencies
npm run install:all

# Run backend
npm run server

# Run frontend (in a separate terminal)
npm run client
```

---

## 🔒 Security & Secrets Management

- **NO Hardcoded Secrets**: All API keys, database connection strings, and JWT secrets are loaded dynamically from environment variables.
- **Git Protection**: `.gitignore` is pre-configured to strictly ignore all `.env` files, `node_modules/`, and temporary build artifacts to prevent accidental leaks.
- **Safe Database Logging**: MongoDB credentials are automatically masked in server console logs (`mongodb+srv://user:****@...`).

---

## ☁️ Deployment on Render

This repository is pre-configured to deploy as a **single unified fullstack Web Service** on Render, running both the backend API and serving the production React frontend build from a single port with **zero CORS issues**.

### Option A: 1-Click Blueprint Deployment (Recommended)
1. Push this repository to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/) > **New +** > **Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically read [`render.yaml`](render.yaml) and configure:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
5. Fill in the prompted secrets:
   - `MONGODB_URI`
   - `GROQ_API_KEY`
6. Click **Apply**!

### Option B: Manual Web Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com/) > **New +** > **Web Service**.
2. Select your GitHub repository.
3. Configure the following settings:
   - **Name**: `savory-recipe-finder`
   - **Environment**: `Node`
   - **Region**: Oregon (or nearest to you)
   - **Branch**: `main`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
4. Under **Environment Variables**, add:
   | Key | Value / Example | Notes |
   |---|---|---|
   | `NODE_ENV` | `production` | Enables production mode & static serving |
   | `MONGODB_URI` | `mongodb+srv://<user>:<pwd>@cluster0.xxx.mongodb.net/recipe_finder?retryWrites=true&w=majority` | Your MongoDB Atlas connection URI |
   | `GROQ_API_KEY` | `gsk_...` | Your Groq Cloud API key |
   | `GROQ_MODEL` | `qwen/qwen3.6-27b` | AI Model (or `llama-3.3-70b-versatile`) |
   | `JWT_SECRET` | `a_long_random_secure_secret_string` | Secret for signing auth tokens |
5. Click **Create Web Service**.

For comprehensive step-by-step instructions (including how to set up free MongoDB Atlas), see [DEPLOYMENT.md](DEPLOYMENT.md).

---

## 📁 Project Structure

```text
├── client/                 # React + Vite + TailwindCSS frontend
│   ├── src/
│   │   ├── components/     # UI Modals, 3D Canvas, Chat, Recipe Cards
│   │   ├── utils/          # Voice engine, i18n translations, helpers
│   │   └── App.jsx         # Main application container
│   ├── .env.example        # Frontend environment template
│   └── package.json
├── server/                 # Express.js REST API
│   ├── config/             # JWT & security configs
│   ├── controllers/        # AI, Auth, Recipes, Meal Plans, Groceries
│   ├── models/             # Mongoose Schemas (User, Recipe, etc.)
│   ├── routes/             # Express API routes
│   ├── .env.example        # Backend environment template (NO secrets)
│   ├── package.json
│   └── server.js           # Production server & static client host
├── .gitignore              # Protects secrets & node_modules
├── render.yaml             # Render Blueprint specification
├── package.json            # Root lifecycle scripts for Render
└── README.md
```

---

## 🧪 Health Check
Once deployed, you can verify your service status at:
`https://your-service-name.onrender.com/api/health`
Response:
```json
{
  "status": "ok",
  "environment": "production",
  "timestamp": "2026-10-24T06:30:00.000Z",
  "mongoConnected": true,
  "aiConfigured": true,
  "aiModel": "qwen/qwen3.6-27b"
}
```
