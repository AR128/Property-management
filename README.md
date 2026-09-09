# 🏠 Estara — Property Management System

A full-stack property listing and management platform built with the **MERN stack**. Estara connects property buyers and sellers through a clean client-facing portal, and provides admins with a powerful moderation dashboard.

---

## 🗂️ Monorepo Structure

```
day 11/
├── backend/        # Express.js REST API (Node.js + MongoDB)
├── client/         # Buyer & Seller portal (React + Vite)
├── admin/          # Admin moderation dashboard (React + Vite)
├── package.json    # Root workspace scripts
└── .gitignore
```

---

## 🚀 Live Deployments

| App | URL |
|---|---|
| **Client Portal** | [estara-property.vercel.app](https://estara-property.vercel.app) |
| **Admin Dashboard** | [admin-estara-property.vercel.app](https://admin-estara-property.vercel.app) |
| **Backend API** | [property-management-lr1k.onrender.com](https://property-management-lr1k.onrender.com) |

---

## ✨ Features

### Client Portal
- User **Signup / Login** with JWT authentication
- Identity **KYC Verification** (Aadhaar + PAN + profile photo)
- Browse, search, and filter property listings
- **Become a Seller** with consent flow
- Seller dashboard — create, manage, and toggle visibility of own listings

### Admin Dashboard
- Secure admin login
- View all registered **Sellers** and **Buyers**
- **Approve / Reject / Delete** property listings
- Detailed modals for each user and listing

### Backend API
- RESTful API with **access + refresh token** JWT auth
- **Cloudinary** image uploads for property photos and profile pictures
- **MongoDB** with Mongoose for all data persistence
- Input validation via `express-validator`
- CORS configured via environment variables

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router, Tailwind CSS, Vite |
| Backend | Node.js, Express.js 5 |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (Access + Refresh Tokens), bcryptjs |
| Storage | Cloudinary |
| Deployment | Vercel (frontend), Render (backend) |

---

## ⚡ Getting Started (Local Development)

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the repository
```bash
git clone https://github.com/AR128/Property-management.git
cd Property-management
```

### 2. Install all dependencies
```bash
npm run install:all
```

### 3. Set up environment variables

Copy the example files and fill in your values:
```bash
cp backend/.env.example backend/.env
cp client/.env.example client/.env
cp admin/.env.example admin/.env
```

### 4. Seed the admin account (first time only)
```bash
npm run seed --prefix backend
```

### 5. Run all apps in development
Open **three terminals**:

```bash
# Terminal 1 — Backend
npm run dev:backend

# Terminal 2 — Client portal
npm run dev:client

# Terminal 3 — Admin dashboard
npm run dev:admin
```

| App | URL |
|---|---|
| Backend API | http://localhost:3000 |
| Client Portal | http://localhost:5173 |
| Admin Dashboard | http://localhost:5174 |

---

## 📦 Root Scripts Reference

| Script | Description |
|---|---|
| `npm run install:all` | Install deps for all three apps |
| `npm run dev:backend` | Start backend in dev mode (nodemon) |
| `npm run dev:client` | Start client Vite dev server |
| `npm run dev:admin` | Start admin Vite dev server |
| `npm run build` | Build all three apps for production |
| `npm run build:backend` | Build backend only |
| `npm run build:client` | Build client only |
| `npm run build:admin` | Build admin only |
| `npm run start` | Start backend in production mode |

---

## 🔐 Environment Variables Summary

| File | Key Variables |
|---|---|
| `backend/.env` | `PORT`, `DATABASE_URL`, `JWT_ACCESS_TOKEN`, `JWT_REFRESH_TOKEN`, `CLOUDINARY_*`, `ALLOWED_ORIGINS` |
| `client/.env` | `VITE_API_BASE_URL` |
| `admin/.env` | `VITE_API_BASE_URL` |

---

## 📁 Sub-project Documentation

- [`backend/README.md`](./backend/README.md) — API routes, models, middleware
- [`client/README.md`](./client/README.md) — Client portal pages and components
- [`admin/README.md`](./admin/README.md) — Admin dashboard pages and components

---

## 🌊 Way of Working

```
User registers → Login → KYC Verification
       ↓
  Browse Properties (Buyer)
       ↓ (optional)
  Consent to Seller Agreement → Seller Dashboard
       ↓
  Create Property Listing → Pending Admin Approval
       ↓
  Admin Reviews → Approve / Reject
       ↓
  Listing goes Live on Buyer Dashboard
```

---

## 📄 License

ISC
