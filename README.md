# 🌾 KrishiConnect — Smart AgriTech Platform

> **Tagline:** *Smart Farming. Better Decisions. Better Harvests.*

**KrishiConnect** is an enterprise-grade, full-stack **MERN (MongoDB, Express.js, React.js, Node.js)** agricultural technology web application designed to empower farmers with data-driven agronomy, satellite-backed weather intelligence, clinical soil health diagnostics, live APMC Mandi rates, and direct expert consultations.

Developed to startup-quality standards, this platform is tailored for **college project evaluations, viva defense, hackathons, resumes, and portfolio presentations**.

---

## 🌟 Key Highlights & Feature Matrix

### 1. 🧑‍🌾 Farmer Intelligence & Dashboard
* **Dynamic Agro Metrics:** Live calculations of cultivated acreage, active crop counts, projected harvest tonnage, and estimated seasonal income.
* **🌱 Unique Farm Health Score:** Dynamic composite score (0–100) evaluating soil chemistry (30%), crop foliage health (25%), water efficiency (20%), pest outbreak risk (15%), and farming activity completion (10%). Includes 3 personalized improvement suggestions.
* **Weather Card:** Live temperature, humidity, wind speed, rain probability, and actionable field operational advisories (e.g., spray delays, morning irrigation prompts).
* **Today's Mandi Ticker:** Live wholesale modal rates with real-time price trend indicators (`↑` / `↓`).
* **Upcoming Field Planner Tasks:** Real-time reminders for irrigation cycles, fertilizer top-dressing, and pest scouting.

### 2. 🏡 Farm Management (Full CRUD)
* Register, view, edit, and delete multiple agricultural plots.
* Tracks: Farm Name, Location, Area (Acres), Soil Type (Black, Alluvial, Red, etc.), Irrigation System (Drip, Sprinkler, Canal), Water Source (Borewell, Canal, River), and Farming Method (Organic, Conventional, Natural).

### 3. 🌿 Smart Crop Portfolio (Full CRUD)
* Register cultivated varieties with sowing date, area, fertilizer history, and expected harvest date.
* **5-Stage Growth Stepper:** Visual tracking through `Seedling` ➔ `Vegetative` ➔ `Flowering` ➔ `Fruiting` ➔ `Harvest Ready`.
* Health status monitoring (`Healthy`, `Moderate`, `Needs Attention`, `Diseased`) and automated harvest countdown timers.

### 4. 🧭 Smart Crop Advisor
* Rule-based agronomic recommendation engine matching plot parameters: Location, Soil Type, Soil pH, Farming Season (`Kharif`, `Rabi`, `Zaid`), and Water Availability.
* Provides suitability percentage (e.g. 98%), growing duration, water demand, expected yield per acre, and agronomic care guidelines.

### 5. 🧪 Soil Health Laboratory & Soil Score
* Diagnostic input for Soil pH, Nitrogen ($N$), Phosphorus ($P$), Potassium ($K$), Soil Moisture (%), and Organic Carbon ($OC$).
* Computes an instant **Soil Health Score (0–100)** with clinical progress bars and personalized corrective recipes (e.g., lime dosage for acidic soils, gypsum for alkaline soils).
* Persistent history of past soil tests.

### 6. 🌦 Weather Intelligence & Radar
* Real-time meteorological telemetry for any Indian district (Bhopal, Indore, Sehore, Jaipur, Rajkot, Nagpur, Ludhiana, etc.).
* 7-day agro-met forecast cards with rain probability, maximum/minimum temperatures, sunrise, sunset, and agricultural advisories.

### 7. 📈 Mandi Price Tracker (APMC Agmarknet)
* Search and filter wholesale auction prices across key Indian mandis (Bhopal, Indore, Ujjain, Dewas, Jaipur, Rajkot, Karnal, Lasalgaon, etc.).
* Filter by crop, state, or search keyword; sort by price or percentage gainers; view min/max auction brackets and daily arrival tonnage.

### 8. 🩺 Crop Doctor (Pathology Diagnostic Tool)
* Interactive diagnosis by crop (Wheat, Soybean, Cotton, Tomato, Chickpea, Mustard) and observed symptom (Yellow leaves, Brown spots, Wilting, Leaf holes, Insect damage, Stunted growth).
* Displays: Identified Problem, Observed Symptoms, Recommended Chemical/Bio Action, Long-term Prevention, and Severity Level.
* Includes mandatory educational disclaimer.

### 9. 🐛 Pest & Disease Surveillance Alerts
* Early warning alerts for major regional outbreaks (Yellow Stripe Rust, Pink Bollworm, Girdle Beetle, Aphids).
* Color-coded risk levels (`High`, `Medium`, `Low`), symptom checklists, and 1-click inspection resolution.

### 10. 📅 Farm Planner (Field Activity Scheduler)
* Calendar and List views for field tasks: Irrigation, Fertilizer Application, Pest Inspection, Sowing, and Harvesting.
* Mark activities as `Upcoming`, `Completed`, or `Overdue`.

### 11. 🛒 Krishi Market & E-Commerce
* Storefront categorized into Seeds, Fertilizers, Organic Manure, Farming Tools, Irrigation Equipment, and Plant Protection.
* Features: Search, category filtering, sort by price/rating, stock quantity tracking.
* **Shopping Cart & Checkout:** Real-time quantity adjustment, delivery address capture, Cash on Delivery / Kisan Credit Card (KCC) payment options, and celebration animations on order completion.
* **Order Tracking Timeline:** Visual step progression (`Confirmed` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`).

### 12. 👨‍🌾 Ask an Agricultural Expert
* Directory of verified ICAR & KVK agricultural scientists with experience, ratings, and specializations (Soil Science, Crop Management, Pest Management, Organic Farming, Irrigation, Horticulture).
* Interactive booking system with preferred date, time, and detailed question submission.

### 13. 💬 Krishi Community (कृषि चौपाल)
* Knowledge-sharing forum where farmers publish agronomic tips and crop issues.
* Categories: Crop Problems, Soil Health, Weather, Pest Control, Irrigation, Organic Farming, Market Prices.
* Full interaction support: Like posts and comment threads.

### 14. 🤖 Krishi Assistant (कृषि सहायक)
* Conversational AI chatbot pre-trained on Indian agricultural practices, ICAR guidelines, N-P-K ratios, irrigation windows, and government schemes (PM-KISAN, PMFBY, Soil Health Card, KCC).
* Interactive suggestion chips for quick inquiries.

### 15. 📊 Farm Analytics & Yield Estimation
* Interactive charts powered by `Recharts`:
  - Crop Acreage Distribution (Doughnut Chart)
  - Seasonal Revenue Trajectory (Line Chart)
* Section 33 Harvest Estimation table detailing acreage, growth stage, productivity benchmark, and projected income in ₹.

### 16. 🛡️ Comprehensive Admin Command Central
* Dedicated administrative portal accessible only to authorized administrators (`role: 'Admin'`).
* **Users Management:** Search farmers, toggle account active/deactivated state, delete accounts.
* **Product Catalog:** Add, edit, delete market items and update warehouse stock.
* **Orders Fulfillment:** View all customer purchases and update dispatch status (`Processing`, `Shipped`, `Delivered`).
* **Expert Registry:** Onboard, update, or remove agricultural scientists.
* **Pest Alerts:** Publish and manage district-level outbreak warnings.
* **Aggregated Soil Reports:** District-wide soil chemistry monitoring.

### 17. 🌐 Multilingual English & Hindi Support
* Instant language toggle (English | हिंदी) in navigation and dashboard.
* Translates all primary navigation menus, cards, status badges, and action buttons.

---

## 🛠 Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Bootstrap 5, Lucide React, Recharts, Canvas Confetti |
| **Backend** | Node.js, Express.js (REST API Architecture, Centralized Error Handling, Morgan Logging) |
| **Database** | MongoDB 8.x, Mongoose ODM (MongoDB Atlas & Local Compatible) |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs password hashing, Role-Based Access Control (RBAC) |
| **State & Context** | React Context API (`AuthContext`, `LanguageContext`, `CartContext`) |

---

## 📁 Project Architecture & Directory Structure

```text
KrishiConnect/
│
├── client/                               # Frontend React Application (Vite)
│   ├── public/                           # Static assets
│   ├── src/
│   │   ├── assets/                       # Agriculture brand graphics
│   │   ├── components/
│   │   │   ├── common/                   # Navbar, Footer, Sidebar, StatCard, LoadingSpinner, EmptyState
│   │   │   ├── dashboard/                # WeatherCard, MandiCard, HealthScoreGauge, UpcomingActivities
│   │   │   ├── crops/                    # Crop cards & progress bars
│   │   │   ├── farms/                    # Farm cards & management
│   │   │   ├── market/                   # Product cards & filters
│   │   │   └── experts/                  # Consultation booking modals
│   │   ├── context/                      # AuthContext, LanguageContext, CartContext
│   │   ├── layouts/                      # MainLayout (public), DashboardLayout (protected)
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx           # Agriculture hero, stats, features, how it works
│   │   │   ├── LoginPage.jsx             # JWT auth with 1-click demo fillers
│   │   │   ├── RegisterPage.jsx          # Farmer signup with validation
│   │   │   ├── FarmerDashboard.jsx       # 4 metric cards, weather, score gauge, mandi, tasks
│   │   │   ├── FarmManagement.jsx        # Land plots CRUD
│   │   │   ├── CropManagement.jsx        # Crops CRUD with 5-stage tracker
│   │   │   ├── CropAdvisor.jsx           # Rule-based crop recommendation engine
│   │   │   ├── SoilHealth.jsx            # Soil health score (0-100) & recommendations
│   │   │   ├── WeatherIntelligence.jsx   # 7-day forecast & operational advisories
│   │   │   ├── MandiPrices.jsx           # Indian Mandi rates, filter & sort
│   │   │   ├── CropDoctor.jsx            # Symptom-based disease diagnosis
│   │   │   ├── PestAlerts.jsx            # Regional pest warnings & resolution
│   │   │   ├── FarmPlanner.jsx           # Field activity scheduler
│   │   │   ├── KrishiMarket.jsx          # Agri e-commerce catalog
│   │   │   ├── CartPage.jsx              # Shopping cart & checkout
│   │   │   ├── MyOrders.jsx              # Order tracking timeline
│   │   │   ├── ExpertConsultation.jsx    # Agronomist appointment booking
│   │   │   ├── KrishiCommunity.jsx       # Farmer forum, posts, likes, replies
│   │   │   ├── KrishiAssistant.jsx       # AI conversational agricultural chatbot
│   │   │   ├── FarmAnalytics.jsx         # Recharts charts & harvest estimation
│   │   │   ├── NotificationsPage.jsx     # Alert center with unread badges
│   │   │   ├── ProfilePage.jsx           # Farmer profile & language settings
│   │   │   └── admin/                    # Admin Dashboard, Users, Products, Orders, Experts, Pests, Reports
│   │   ├── services/                     # Axios API client (`api.js`)
│   │   ├── utils/                        # Translations (EN / HI)
│   │   ├── App.jsx                       # Client routing & ProtectedRoute
│   │   ├── main.jsx                      # App root
│   │   └── index.css                     # Custom agricultural design system
│   ├── index.html
│   ├── vite.config.js                    # Vite dev config with `/api` proxy
│   └── package.json
│
├── server/                               # Backend Express.js Server
│   ├── config/                           # Database connection (`db.js`)
│   ├── controllers/                      # Auth, Farm, Crop, Soil, Weather, Mandi, Orders, etc.
│   ├── middleware/                       # `authMiddleware.js` (JWT & RBAC), `errorMiddleware.js`
│   ├── models/                           # 13 Mongoose Schemas (User, Farm, Crop, SoilReport, etc.)
│   ├── routes/                           # Express modular routers
│   ├── services/                         # Weather, Mandi, Crop Doctor, Advisor, Assistant, Health Score
│   ├── seed/                             # Realistic database seeder (`seed.js`)
│   ├── server.js                         # Server entry & static frontend serving
│   ├── .env                              # Environment variables
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── .env.example
├── README.md
└── package.json                          # Monorepo runner scripts
```

---

## 🚀 Installation & Setup Guide

### Prerequisites
* **Node.js**: v18.x or v20.x+ (Installed in user directory: `C:\Users\Sheena\AppData\Local\Programs\nodejs`)
* **MongoDB**: Local MongoDB Server v7.x / v8.x running on port `27017` or a free MongoDB Atlas connection string.

---

### Step 1: Clone or Navigate to Project
```bash
cd "C:\Users\Sheena\.gemini\antigravity\scratch\KrishiConnect"
```

---

### Step 2: Configure Environment Variables
Verify or create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/krishiconnect
JWT_SECRET=krishi_connect_super_secret_jwt_key_2026_secure
NODE_ENV=development
WEATHER_API_KEY=
```
*(Note: If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string `mongodb+srv://<user>:<password>@cluster.mongodb.net/krishiconnect`)*

---

### Step 3: Seed the Database with Realistic Demo Data
The seed script creates the Farmer demo account, Admin demo account, farms, crops, soil reports, products, orders, experts, consultations, pest alerts, community discussions, and activities:

```bash
cd server
npm run seed
```

**Expected Output:**
```text
[Seed]: Connected to MongoDB...
[Seed]: Cleared existing database records.
[Seed]: Users seeded.
[Seed]: Farms seeded.
[Seed]: Crops seeded.
[Seed]: Soil Reports seeded.
[Seed]: Products seeded.
[Seed]: Orders seeded.
[Seed]: Experts seeded.
[Seed]: Consultations seeded.
[Seed]: Pest Alerts seeded.
[Seed]: Community Posts seeded.
[Seed]: Farm Activities seeded.
[Seed]: Notifications seeded.

===========================================
✅ KrishiConnect Database Seeding Complete!
===========================================
Farmer Demo:  farmer@krishiconnect.demo  /  Farmer@123
Admin Demo:   admin@krishiconnect.demo   /  Admin@123
===========================================
```

---

### Step 4: Run the Application

#### Option A: Unified Production Mode (Frontend & Backend on Single Port 5000)
```bash
cd server
node server.js
```
Open your browser and navigate to:
👉 **`http://localhost:5000`**

#### Option B: Development Mode (Hot Reloading with Vite + Express)
**Terminal 1 (Backend Server):**
```bash
cd server
npm run dev
# Starts backend API on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Starts React frontend on http://localhost:5173 with API proxy
```
Open your browser and navigate to:
👉 **`http://localhost:5173`**

---

## 🔑 Demonstration Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Farmer** | `farmer@krishiconnect.demo` | `Farmer@123` | Full Farmer Portal (Crops, Soil, Mandi, Orders, Expert Consultations) |
| **Administrator** | `admin@krishiconnect.demo` | `Admin@123` | Admin Command Central (Users, Catalog, Logistics, Pest Outbreaks) |

*(Convenience Feature: The login page includes 1-click quick-fill buttons for both demonstration accounts.)*

---

## 📡 API Overview (Postman Compatible)

### Authentication
* `POST /api/auth/register` — Register a new farmer (Farmer role assigned by default)
* `POST /api/auth/login` — Authenticate and receive JWT token + profile
* `GET  /api/auth/me` — Get authenticated user details
* `PUT  /api/auth/profile` — Update user profile and language preference

### Farms & Crops
* `GET    /api/farms` — Get all farms of logged-in user
* `POST   /api/farms` — Register a new farm plot
* `GET    /api/farms/:id` — Get single farm with associated crops
* `PUT    /api/farms/:id` — Update farm parameters
* `DELETE /api/farms/:id` — Delete farm and dependent crops
* `GET    /api/crops` — Get all user crops with farm populated
* `POST   /api/crops` — Register crop with growth stage and health
* `PUT    /api/crops/:id` — Update crop stage and health
* `DELETE /api/crops/:id` — Delete crop record

### Soil Health
* `GET    /api/soil` — Get saved soil test reports
* `POST   /api/soil` — Submit laboratory N-P-K assays, calculate score (0-100) and save
* `DELETE /api/soil/:id` — Delete soil report

### Agronomy & Services
* `GET  /api/weather?location=Bhopal` — Weather telemetry, 7-day forecast & advisories
* `GET  /api/mandi?crop=Wheat&state=Madhya+Pradesh` — Filtered APMC Mandi rates
* `POST /api/crop-doctor/diagnose` — Symptom-based diagnosis engine
* `POST /api/crop-advisor/recommend` — Rule-based crop suitability matrix
* `GET  /api/pests` — Active pest outbreak surveillance alerts
* `POST /api/assistant/ask` — Conversational agricultural AI chatbot

### Commerce & Logistics
* `GET  /api/resources` — Catalog with category filters & price sorting
* `POST /api/orders` — Place order, validate stock, schedule delivery
* `GET  /api/orders/my` — Get order history with tracking timeline

### Expert Consultation & Community
* `GET  /api/experts` — List verified agricultural scientists
* `POST /api/experts/consultations` — Book appointment with date, time, and query
* `GET  /api/experts/consultations/my` — View scheduled appointments
* `GET  /api/community` — Forum posts with category filter
* `POST /api/community` — Publish discussion topic
* `POST /api/community/:id/like` — Toggle like on post
* `POST /api/community/:id/comments` — Post reply or tip

### Analytics & Administration
* `GET   /api/analytics/farmer` — Farmer score breakdown, expected harvest, income
* `GET   /api/analytics/admin` — Total platform metrics, order status breakdown
* `GET   /api/admin/users` — List and search registered users
* `PATCH /api/admin/users/:id/toggle-status` — Activate or deactivate account
* `DELETE/api/admin/users/:id` — Delete user account and associated plots
* `PUT   /api/orders/:id/status` — Update order delivery status (Admin only)

---

## 🧪 Testing Status & Verification

| Module | Verification Performed | Status |
| :--- | :--- | :---: |
| **Authentication & RBAC** | Registered new farmer; logged in with demo credentials; verified JWT expiration; verified farmer is blocked (HTTP 403) from admin endpoints | ✅ Verified |
| **Farm & Crop Management** | Created farm; added crop; tracked 5 growth stages; verified countdown calculations; tested update & delete operations | ✅ Verified |
| **Soil Health Score** | Tested N-P-K evaluation formula; calculated score (74 to 88/100); verified generation of acidic/alkaline remedies | ✅ Verified |
| **Weather Intelligence** | Verified city search, 7-day forecast generation, and weather advisories | ✅ Verified |
| **Mandi Price Tracker** | Filtered by crop, state, and price sorting across 12 Indian Mandis | ✅ Verified |
| **Crop Doctor** | Tested pathological diagnosis for Wheat, Soybean, Tomato; verified remedies and disclaimer display | ✅ Verified |
| **Commerce & Orders** | Added products to cart; checked out with shipping address; verified stock decrement and order tracking timeline | ✅ Verified |
| **Admin Controls** | Tested user deactivation, order status updates, expert onboarding, and aggregated reports | ✅ Verified |
| **Multilingual UI** | Verified live English and Hindi text translations across navigation and dashboard cards | ✅ Verified |
| **Responsive Design** | Tested on desktop, tablet, and mobile viewport layouts | ✅ Verified |

## 🌾 Final Brand Message

**KrishiConnect**  
*Smart Farming. Better Decisions. Better Harvests.*  
*Empowering Indian agriculture through technology.*
