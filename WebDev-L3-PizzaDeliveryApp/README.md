# 🍕 Nayab's Pizzeria — 3D Pizza Delivery & Real-Time Inventory Platform

> **Oasis Infobyte Web Development & Designing Internship (OIBSIP) — Level 3 Task**  
> **Developer:** Nayab Farooq  
> **Track:** Web Development & Designing  
> **Project Identifier:** `WebDev-L3-PizzaDeliveryApp`

---

## 🌟 Executive Summary

**Nayab's Pizzeria** is a production-grade full-stack MERN web application featuring:
- **Interactive 3D Pizza Customizer:** Built with **Three.js** and WebGL, allowing customers to rotate, zoom, and inspect their custom pizza in 3D while crust, sauce, cheese, and toppings update in real time.
- **Obsidian & Woodfire Ember Aesthetic:** Frosted glassmorphism, radial glow lighting, floating 3D ingredient badges, and dynamic 3D parallax tilt effects.
- **Automated Inventory Management Engine:** Every customer order automatically decrements ingredient stocks in MongoDB. When stock levels drop to or below the safety threshold (`<= 20 units`), visual warning badges and automated background cron jobs (`node-cron`) are triggered.
- **1-Click Evaluator Admin Access Bypass:** A streamlined evaluator mode switcher that allows evaluators to inspect admin inventory tables and order controllers with a single click without browser password manager interference.
- **Simulated Razorpay Payment Modal:** An authentic branded payment gateway experience supporting UPI, Cards, and Netbanking with realistic 3D secure processing and immediate transaction receipts (`pay_xxxxxxxx`).
- **Live 4-Stage Order Tracker:** Polling every 4 seconds with animated visual progress dots (`Order Received` ➔ `In Kitchen` ➔ `Sent to Delivery` ➔ `Delivered`).

---

## 🏗️ Architecture & Tech Stack

```mermaid
graph TD
    Client[React 19 + Vite + Three.js Frontend] -->|REST API Requests / JWT| Server[Node.js + Express Server]
    Server -->|Mongoose ODM| Atlas[(MongoDB Atlas Cloud DB)]
    Server -->|Background Cron Monitor| Cron[node-cron Inventory Monitor]
    Client -->|Simulated Razorpay Gateway| Pay[Payment Modal & Receipt Engine]
```

### 1. Frontend (`client/`)
- **Core:** React 19, Vite 8 (Hot Module Replacement)
- **3D Graphics & Visuals:** Three.js (Procedural geometries, custom canvas leopard char textures, studio lighting, ember particle systems)
- **Styling:** Vanilla CSS with custom design system (`index.css`):
  - Obsidian & Woodfire Ember color scheme
  - 3D Parallax tilt physics with reactive cursor glare
  - Floating 3D ingredient badges with depth-of-field keyframe animations
- **Icons & UI:** Lucide React

### 2. Backend (`server/`)
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB Atlas (Cloud Replica Set) via Mongoose 8
- **Authentication:** JSON Web Tokens (JWT) + BcryptJS password hashing
- **Automation:** `node-cron` background scheduler (runs threshold checks every 30 minutes)
- **CORS & Environment:** CORS middleware + Dotenv

---

## 📂 Repository Structure

```
OIBSIP/
└── WebDev-L3-PizzaDeliveryApp/
    ├── README.md                     # Comprehensive documentation & evaluation guide
    ├── server/                       # Backend Express API & Database models
    │   ├── .env                      # Environment configuration
    │   ├── package.json              # Server dependencies & scripts
    │   ├── server.js                 # Server entrypoint & DB connection
    │   ├── seeder.js                 # Database seeder script
    │   ├── models/                   # Mongoose Schemas (User, Pizza, Inventory, Order)
    │   ├── routes/                   # REST API Routes (auth, pizzas, orders, admin)
    │   ├── middleware/               # Auth token verification & Admin role guard
    │   └── utils/                    # Background cron jobs (inventory threshold alert)
    └── client/                       # Frontend React + Vite application
        ├── index.html                # Entry HTML with Outfit & Plus Jakarta fonts
        ├── package.json              # Client dependencies (React 19, Three.js, Lucide)
        ├── vite.config.js            # Vite configuration
        └── src/
            ├── main.jsx              # React root mounting
            ├── App.jsx               # Main SPA controller (Menu, 3D Builder, Cart, Orders, Admin)
            ├── index.css             # Obsidian Ember theme & 3D animation tokens
            └── components/
                ├── PizzaCanvas3D.jsx # Three.js 3D Pizza visualizer (Hero & Builder modes)
                ├── TiltCard.jsx      # 3D Parallax hover tilt with realistic glare
                └── RazorpayModal.jsx # Simulated Razorpay payment gateway & receipt generator
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- Active Internet connection (for MongoDB Atlas connectivity)

### Step 1: Clone Repository
```bash
git clone https://github.com/your-username/OIBSIP.git
cd OIBSIP/WebDev-L3-PizzaDeliveryApp
```

### Step 2: Configure & Start Backend Server
```bash
cd server
npm install
```

Ensure `server/.env` contains your settings (pre-configured for live MongoDB Atlas):
```env
PORT=5000
MONGO_URI=mongodb+srv://farooqnayab61_db_user:LJEki8Fvipcaj43p@cluster0.r42oabn.mongodb.net/pizzadelivery?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=oibsip_super_secret_jwt_key_2026
ADMIN_EMAIL=admin@pizzadelivery.com
```

Seed initial database items (Bases, Sauces, Cheeses, Veggies, Artisan Pizzas, and Admin):
```bash
node seeder.js
```

Start backend in development mode:
```bash
npm run dev
# Or for standard execution:
node server.js
```
*Backend runs on `http://localhost:5000`*

### Step 3: Start Frontend Client
In a new terminal window:
```bash
cd ../client
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🔑 Demo & Admin Credentials

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@pizzadelivery.com` | `admin123` | Full Inventory Monitor, Restock Controls, Order Status Updater |
| **Customer** | `nayab@example.com` | `password123` | Browse Menu, 3D Custom Pizza Builder, Razorpay Checkout, Live Order Tracker |

> ⚡ **Evaluator Quick Access:**  
> Evaluators do not need to manually type passwords. Click the **"⚡ Admin Mode (1-Click Bypass)"** button in the purple evaluator top banner, or click the **"⚡ Admin Panel"** tab in the navbar. It instantly switches to administrator mode and streams live data from MongoDB Atlas.

---

## 🎨 3D Graphics & Visual Features

1. **Procedural 3D Pizza Engine (`PizzaCanvas3D.jsx`):**
   - **Crust:** Geometric cylinder and puffy outer torus rim with procedural woodfire char leopard-spotting canvas texture.
   - **Sauce:** Layered disc with specular roughness matching sauce types (crimson Marinara, fiery Peri-Peri, silky Alfredo, smoky dark BBQ, herbal Pesto).
   - **Cheese:** Procedurally baked cheese mesh with melted blister spots.
   - **3D Toppings:** Procedurally distributed 3D meshes (sliced Portobello mushrooms, black olive rings, bell pepper arcs, red onion slivers, pickled jalapeño rings, organic fresh basil leaves, and diced tomatoes).
   - **Studio Lighting:** Warm directional key light, ember orange rim light, and background drifting ember particles.
   - **User Controls:** Drag to rotate, scroll/wheel to zoom, reset view button, and toggleable auto-rotation.
2. **3D Parallax Tilt (`TiltCard.jsx`):**
   - Calculates cursor coordinates relative to card center and applies `perspective(1000px) rotateX(...) rotateY(...)` with dynamic specular glare highlight.
3. **Layered 3D Depth Badges:**
   - Ambient floating ingredients with smooth floating sine animations and frosted glassmorphic backdrops.

---

## 💳 Simulated Razorpay Payment Gateway

When clicking **"Pay with Razorpay"** at checkout:
1. Opens an authentic Razorpay dialog with order total, merchant branding, and payment method selector.
2. Select between **UPI / QR**, **Credit / Debit Cards**, or **Netbanking**.
3. Simulates TLS 1.3 gateway handshake and 3D Secure 2.0 authorization.
4. Generates a unique transaction receipt: `pay_XXXXXXXXXXXX`.
5. Records the payment in MongoDB Atlas, decrements ingredient stock counts, and redirects to the **Live Order Tracker**.

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new customer (`name`, `email`, `password`).
- `POST /api/auth/login` — Login user or admin, returns JWT token.
- `GET /api/auth/me` — Verify session and fetch current user profile (`Bearer <token>`).

### Pizzas & Builder (`/api/pizzas`)
- `GET /api/pizzas` — Retrieve all artisan preset pizzas.
- `GET /api/pizzas/builder-options` — Retrieve available bases, sauces, cheeses, and veggies with real-time stock counts and prices.

### Orders (`/api/orders`)
- `POST /api/orders` — Create a new order, decrements MongoDB inventory for each ingredient (`Bearer <token>`).
- `GET /api/orders/my-orders` — Fetch orders belonging to the authenticated customer.
- `GET /api/orders/:id` — Fetch live order status.

### Admin Management (`/api/admin`)
*(Requires Admin JWT token)*
- `GET /api/admin/inventory` — Fetch full inventory with low stock warning alerts.
- `PUT /api/admin/inventory/:id` — Update stock count or unit price.
- `GET /api/admin/orders` — Fetch all customer orders across the platform.
- `PUT /api/admin/orders/:id/status` — Update order status (`Order Received` ➔ `In Kitchen` ➔ `Sent to Delivery` ➔ `Delivered`).

---

## 📹 Oasis Infobyte Demo Video Guidelines

For the mandatory project submission video:

### 1. Opening Title Card (Mandatory 2 Seconds)
Display the following text on screen for the first 2 seconds of the video:
```
=====================================================
FULL NAME:         Nayab Farooq
INTERNSHIP TRACK:  Web Development & Designing
TASK:              Level 3 — Pizza Delivery Full-Stack Application
PROJECT:           Nayab's Pizzeria (MERN + Three.js)
ORGANIZATION:      Oasis Infobyte (OIBSIP)
=====================================================
```

### 2. Video Demonstration Walkthrough Checklist (2–3 Minutes)
1. **0:00 - 0:02:** Display the Opening Title Card.
2. **0:02 - 0:30:** Showcase the Landing Page & Hero Section:
   - Highlight the interactive 3D Floating Hero Pizza (drag to orbit, zoom, ambient ember particles).
   - Point out the Obsidian & Woodfire Ember design and 3D parallax tilt effects on artisan pizza cards.
3. **0:30 - 1:15:** Demonstrate the 3D Custom Pizza Builder:
   - Show how changing Crust, Sauce, Cheese, and Toppings modifies the 3D model in real time.
   - Add the customized pizza to the cart.
4. **1:15 - 1:45:** Demonstrate Checkout & Razorpay Simulation:
   - Review cart, enter delivery address, click "Pay with Razorpay".
   - Show method selection (UPI/Card), click Pay Securely, and show the instant transaction receipt (`pay_xxxxxxxx`).
5. **1:45 - 2:15:** Live Order Tracker & Admin Real-time Control:
   - Show the 4-stage tracking progress bar for the newly placed order.
   - Switch to **Admin Mode (1-Click Bypass)**.
   - Highlight the **Stock & Inventory Monitor** table (showing decremented ingredients & low stock warnings).
   - Click **+ Restock** to demonstrate instant stock restocking.
   - Update the customer order stage to `In Kitchen` or `Sent to Delivery` and show live synchronization.
6. **2:15 - 2:30:** Concluding remarks and internship acknowledgment.

---

## 📜 Submission Compliance & Verification

- ✅ Folder structure strictly named `WebDev-L3-PizzaDeliveryApp` under repository `OIBSIP`.
- ✅ Full MERN stack running with MongoDB Atlas, Express, React 19, and Node.js.
- ✅ Automated stock decrementation and threshold alert logic (`<= 20`).
- ✅ 3D interactive Three.js pizza visualizer with dynamic textures and lighting.
- ✅ Evaluator 1-click bypass resolving browser password manager interception.
- ✅ Simulated Razorpay payment flow with receipt generation.

---

*Developed with passion for the Oasis Infobyte Web Development & Designing Internship.*
