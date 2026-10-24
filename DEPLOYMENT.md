# 🚢 Complete Deployment Guide: GitHub & Render

This step-by-step walkthrough will guide you through uploading your project to **GitHub** safely and deploying it live on **Render**.

---

## 📋 Table of Contents
1. [Important Security Check](#1-important-security-check)
2. [Step 1: Upload Project to GitHub](#2-step-1-upload-project-to-github)
3. [Step 2: Get Free MongoDB Atlas Cloud Database](#3-step-2-get-free-mongodb-atlas-cloud-database)
4. [Step 3: Get Free Groq AI API Key](#4-step-3-get-free-groq-ai-api-key)
5. [Step 4: Deploy on Render](#5-step-4-deploy-on-render)
6. [Step 5: Verify Your Live App](#6-step-5-verify-your-live-app)
7. [Troubleshooting & FAQs](#7-troubleshooting--faqs)

---

## 1. Important Security Check

Your workspace is now pre-configured for safe public uploading:
- ✅ **All hardcoded secrets have been removed** from the codebase.
- ✅ Secrets are strictly read via `process.env`.
- ✅ A multi-layer `.gitignore` is in place ignoring:
  - `server/.env`
  - `client/.env`
  - All `node_modules/` folders
  - Build folders (`dist/`, `build/`)
- ✅ Templates [`server/.env.example`](server/.env.example) and [`client/.env.example`](client/.env.example) are provided for reference.

> [!WARNING]
> NEVER upload your `server/.env` file to GitHub! The `.gitignore` will automatically prevent it when using Git.

---

## 2. Step 1: Upload Project to GitHub

### Method A: Using Git CLI (Recommended)
If Git is installed on your computer:
1. Open PowerShell / Command Prompt in this folder (`c:\Users\Admin\Desktop\Recipe finder website`):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Ready for Render deployment"
   ```
2. Create a new repository on [GitHub](https://github.com/new) (e.g. `savory-recipe-finder`):
   - Leave "Add a README" and "Add .gitignore" **unchecked** (we already have them!).
3. Link your local repo and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

### Method B: Using GitHub Desktop
1. Download & open [GitHub Desktop](https://desktop.github.com/).
2. Click **File** > **Add Local Repository...**.
3. Select this folder (`c:\Users\Admin\Desktop\Recipe finder website`).
4. If prompted to create a repository, click **Create a Repository**.
5. Click **Publish repository** to push to your GitHub account (make sure it's public or private as you prefer).

### Method C: Using VS Code
1. Open this folder in VS Code.
2. Click the **Source Control** icon on the left sidebar (Ctrl + Shift + G).
3. Click **Publish to GitHub**.
4. Choose either Public or Private repository.

---

## 3. Step 2: Get Free MongoDB Atlas Cloud Database

Render web services need a cloud database accessible over the internet. MongoDB Atlas provides a 100% free forever tier (M0 cluster).

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and sign in / sign up.
2. Click **Create a Deployment** and select the **Free (M0)** shared cluster.
3. Choose your cloud provider & region (e.g. AWS / us-east-1).
4. Under **Security Quickstart**:
   - Create a database user (e.g., username: `dbAdmin`, password: `YourStrongPassword123!`). **Save this password!**
5. Under **Network Access** (CRITICAL):
   - Click **Add IP Address**.
   - Select **Allow Access From Anywhere (`0.0.0.0/0`)** so Render's cloud servers can connect to your database.
6. Click **Database** in the left menu > click **Connect** next to your cluster.
7. Select **Drivers** (Node.js).
8. Copy the connection string. It will look like this:
   ```text
   mongodb+srv://dbAdmin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```
9. Replace `<password>` with your real database user password, and append `/recipe_finder` before the `?`:
   ```text
   mongodb+srv://dbAdmin:YourStrongPassword123!@cluster0.abcde.mongodb.net/recipe_finder?retryWrites=true&w=majority
   ```
   *This is your `MONGODB_URI`!*

---

## 4. Step 3: Get Free Groq AI API Key

1. Go to [console.groq.com](https://console.groq.com) and log in.
2. Navigate to **API Keys** in the left sidebar.
3. Click **Create API Key**.
4. Name it `recipe-finder` and copy the key (starts with `gsk_...`).
   *This is your `GROQ_API_KEY`!*

---

## 5. Step 4: Deploy on Render

### Using 1-Click Blueprint (Simplest)
Because this repo includes [`render.yaml`](render.yaml):
1. Go to [dashboard.render.com](https://dashboard.render.com/).
2. Click **New +** (top right) > **Blueprint**.
3. Connect your GitHub account and select your recipe finder repository.
4. Render will inspect `render.yaml` and prompt you for the required values:
   - `MONGODB_URI`: Paste your MongoDB Atlas connection string.
   - `GROQ_API_KEY`: Paste your Groq API key (`gsk_...`).
   - `JWT_SECRET`: Render will auto-generate this securely for you!
5. Click **Apply**.
6. Render will run `npm run build`, install dependencies, compile the frontend, and start `npm start`!

### Manual Web Service Setup (Alternative)
1. Go to [dashboard.render.com](https://dashboard.render.com/).
2. Click **New +** > **Web Service**.
3. Choose **Build and deploy from a Git repository** > select your repo.
4. Fill in the service details:
   - **Name**: `savory-recipe-finder`
   - **Language / Runtime**: `Node`
   - **Region**: Oregon (or Frankfurt / Singapore)
   - **Branch**: `main`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Scroll down to **Environment Variables** and add the following 5 variables:

| Variable Name | Value | Purpose |
|---|---|---|
| `NODE_ENV` | `production` | Tells Express to serve the static frontend bundle |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster0.xxx.mongodb.net/recipe_finder?retryWrites=true&w=majority` | Cloud database connection string |
| `GROQ_API_KEY` | `gsk_...` | Groq AI Cloud API Key |
| `GROQ_MODEL` | `qwen/qwen3.6-27b` | AI model (or `llama-3.3-70b-versatile`) |
| `JWT_SECRET` | *(click "Generate" or type a long random string)* | Key for signing authentication tokens |

6. Click **Deploy Web Service**!

---

## 6. Step 5: Verify Your Live App

1. Once the deployment log displays:
   ```text
   📦 Serving static client build from .../client/dist
   🍃 Connected to MongoDB at mongodb+srv://...
   🚀 Master Chef Recipe Backend running on port 10000
   ==> Your service is live 🎉
   ```
2. Open your Render URL (e.g. `https://savory-recipe-finder.onrender.com`).
3. You will see the complete application:
   - 3D interactive hero scene
   - Authentic Indian & global recipes from MongoDB
   - Real-time AI Recipe Generator powered by Groq
   - AI Sous-Chef Chatbot
   - Multi-language voice narration and recipe translation
   - Smart Meal Planner & Grocery Checklist
4. Check the health status anytime at:
   `https://your-service-name.onrender.com/api/health`

---

## 7. Troubleshooting & FAQs

### Q: Why does the first load take 30-50 seconds?
> [!NOTE]
> Render's free tier spins down web services after 15 minutes of inactivity. When a new visitor accesses your URL, it will wake up automatically in ~40 seconds. Once awake, performance is instant.

### Q: Why am I getting "MongoDB Connection Error" in Render logs?
1. Check **Network Access** in MongoDB Atlas: Ensure `0.0.0.0/0` (Allow access from anywhere) is enabled.
2. Check your database password in the connection URI: Special characters (like `@`, `#`, `%`) in the password must be URL-encoded, or simplify your database password in MongoDB Atlas.

### Q: What if I want to deploy frontend and backend separately?
You can also host the frontend on Vercel or Render Static Sites!
- In your frontend environment variables, set `VITE_API_URL=https://your-backend.onrender.com`.
- In your backend environment variables, set `CLIENT_URL=https://your-frontend.vercel.app`.
