# 🚀 Nayab's Pizzeria - Deployment & Sharing Guide

This guide walks you through deploying **Nayab's Pizzeria** so you can share a live public link with your friends and internship evaluators.

---

## 🌟 Method 1: Permanent 24/7 Cloud Deployment (Recommended)

This method keeps your website online 24/7 forever, even when your computer is turned off.

### Step 1: Push Code to GitHub
Your repository has already been initialized and committed with `.gitignore` protecting all secret keys.

1. Go to [GitHub.com](https://github.com) and create a **New Repository**:
   - Repository name: `nayabs-pizzeria`
   - Visibility: **Public**
   - Do **NOT** check "Initialize with README" (we already have one).
   - Click **Create repository**.
2. In your terminal at `c:\Users\HomePC\Desktop\OIBSIP`, run:
   ```bash
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/nayabs-pizzeria.git
   git push -u origin main
   ```

---

### Step 2: Deploy Frontend on Vercel (Takes 60 Seconds - 100% Free)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New...** -> **Project**.
3. Locate your `nayabs-pizzeria` repository and click **Import**.
4. Configure Project Settings:
   - **Root Directory**: Click *Edit* and select `WebDev-L3-PizzaDeliveryApp/client`.
   - **Framework Preset**: `Vite` (automatically detected).
5. Click **Deploy**.
6. In ~45 seconds, Vercel gives you your permanent live link:
   👉 `https://nayabs-pizzeria.vercel.app` (You can share this link immediately!)

---

### Step 3: Deploy Backend on Render.com (100% Free)

1. Go to [render.com](https://render.com) and sign in with GitHub.
2. Click **New +** -> **Web Service**.
3. Connect your `nayabs-pizzeria` repository.
4. Fill in the service details:
   - **Name**: `nayabs-pizzeria-api`
   - **Region**: Choose closest to you (e.g., Singapore or Frankfurt)
   - **Root Directory**: `WebDev-L3-PizzaDeliveryApp/server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
5. Scroll down to **Environment Variables** and add:
   - `PORT` = `5000`
   - `MONGO_URI` = `mongodb+srv://farooqnayab61_db_user:LJEki8Fvipcaj43p@cluster0.r42oabn.mongodb.net/pizzadelivery?retryWrites=true&w=majority&appName=Cluster0`
   - `JWT_SECRET` = `oibsip_super_secret_jwt_key_2026`
   - `ADMIN_EMAIL` = `admin@pizzadelivery.com`
6. Click **Create Web Service**.
7. Once deployed, Render will provide your backend URL:
   👉 `https://nayabs-pizzeria-api.onrender.com`

---

### Step 4: Connect Vercel Frontend to Render Backend
1. Go back to your project in **Vercel** -> **Settings** -> **Environment Variables**.
2. Add:
   - **Key**: `VITE_API_BASE`
   - **Value**: `https://nayabs-pizzeria-api.onrender.com/api`
3. Click **Save**, then go to **Deployments** tab and click **Redeploy**.

---

## ⚡ Method 2: Instant Sharing Link (Zero Signups - 30 Seconds)

If you want to share a live working link with your friends on WhatsApp right now while your laptop is running:

1. Keep your Vite dev server running on port `5173`.
2. Open a new PowerShell window and run:
   ```bash
   npx localtunnel --port 5173
   ```
3. It will generate a live HTTPS URL:
   ```
   your url is: https://famous-pizza-99.loca.lt
   ```
4. Copy and send that link to your friends!
   - *Note:* The first time they click the link, localtunnel asks them to enter your public IP (localtunnel displays a link on the page that reveals the IP, they copy-paste it once, and your website loads!).
