# 🛡️ Estara — Admin Dashboard

The admin-facing moderation panel for the Estara Property Management System. Admins can review registered sellers, buyers, and property listings — approving or rejecting them before they go live. Built with **React 19**, **React Router**, **Tailwind CSS**, and **Vite**.

**Live URL:** [admin-estara-property.vercel.app](https://admin-estara-property.vercel.app)  
**Local URL:** `http://localhost:5174`

> 🔒 This app is restricted to authorized admin accounts only. Admin accounts are created via the backend seed script.

---

## 📁 Project Structure

```
admin/
├── public/
├── src/
│   ├── main.jsx                          # React entry point with router setup
│   ├── App.jsx                           # Admin login page (root route)
│   ├── App.css                           # Global base styles
│   ├── config/
│   │   └── api.js                        # API base URL (reads from VITE_API_BASE_URL)
│   ├── utils/
│   │   └── tokenStorage.js               # JWT token management + fetchWithAuth helper
│   ├── components/
│   │   ├── ProtectedRoute.jsx            # Auth guard for the dashboard route
│   │   ├── SellerDetailModal.jsx         # Detailed seller profile modal
│   │   ├── CustomerDetailModal.jsx       # Detailed buyer profile modal
│   │   └── ListingDetailModal.jsx        # Full property listing detail modal with actions
│   └── pages/
│       └── Dashboard.jsx                 # Main admin dashboard with all three panels
├── .env                                  # Environment variables (gitignored)
├── .env.example                          # Environment variable template
├── vercel.json                           # Vercel SPA rewrite rules
├── vite.config.js
└── package.json
```

---

## 🗺️ Page & Route Map

| Route | Component | Auth | Description |
|---|---|---|---|
| `/` | `App.jsx` | ❌ | Admin login form |
| `/admin/dashboard` | `pages/Dashboard.jsx` | ✅ | Main admin panel |

> **Note:** The Vercel `vercel.json` rewrite ensures direct navigation to `/admin/dashboard` works correctly in production (SPA routing fix).

---

## 🧩 Component Reference

### Pages

#### `App.jsx` — Admin Login
The root route renders the login form. Collects `adminName`, `email`, and `password`. On successful authentication:
1. Stores the access token via `tokenStorage`
2. Navigates to `/admin/dashboard`

#### `pages/Dashboard.jsx` — Main Panel
The core admin interface. Fetches all data on mount and presents three tabbed panels:

**Panel 1 — Sellers**
- Lists all users with the `seller` role
- Searchable by name or email
- Click any seller to open `SellerDetailModal` with full profile + listed properties

**Panel 2 — Listings**
- Lists all property listings with filter options: `All`, `Pending`, `Approved`
- Shows approval status badge per listing
- Actions: **Approve**, **Reject**, **Delete** (inline and inside modal)
- Opens `ListingDetailModal` for full property review

**Panel 3 — Buyers**
- Lists all users with the `buyer` role
- Searchable by name or email
- Click any buyer to open `CustomerDetailModal` with profile details

---

### Components

#### `ProtectedRoute.jsx`
Wraps the `/admin/dashboard` route. Verifies the presence of a valid admin access token. Attempts a silent refresh on expiry using the HttpOnly refresh token cookie. Redirects to `/` (login) on failure.

#### `SellerDetailModal.jsx`
Modal displaying full seller profile:
- Profile picture, name, email, verification status
- KYC details (Aadhaar/PAN masked)
- List of the seller's property listings with status badges

#### `CustomerDetailModal.jsx`
Modal displaying full buyer profile:
- Profile picture, name, email
- Account creation date, verification status
- KYC summary

#### `ListingDetailModal.jsx`
The primary property moderation interface:
- Full image gallery with primary image highlight
- Complete property specs: type, purpose, price, area, beds, baths, furnishing, parking
- Address and amenities
- Approval status badge
- Action buttons: **Approve**, **Reject**, **Delete** — with loading states and confirmations

---

## 🔑 Token Management (`utils/tokenStorage.js`)

| Export | Description |
|---|---|
| `getAccessToken()` | Read admin token from `sessionStorage` |
| `setAccessToken(token)` | Store admin token in `sessionStorage` |
| `clearAccessToken()` | Remove token (used on logout/auth failure) |
| `decodeToken(token)` | Decode JWT payload |
| `isAccessTokenExpired(token)` | Check if token is within 30s of expiry |
| `refreshAccessToken()` | Call `/admin/refresh` using the HttpOnly cookie |
| `fetchWithAuth(url, options)` | Drop-in `fetch` wrapper with auto Bearer token + silent refresh |

---

## 🌍 Environment Variables

```env
# admin/.env
VITE_API_BASE_URL=http://localhost:3000
```

For production (Vercel), set `VITE_API_BASE_URL` to your deployed backend URL in Vercel's environment variable settings.

---

## 🚀 Vercel Deployment Notes

The `vercel.json` file contains an SPA rewrite rule that ensures all routes serve `index.html`, allowing React Router to handle client-side navigation correctly:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Without this, direct navigation to `/admin/dashboard` would return a **404** on Vercel.

---

## 📦 Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server on port 5174 |
| `npm run build` | Build for production (`dist/`) |
| `npm start` | Preview production build (`vite preview`) |
| `npm run lint` | Run ESLint |

---

## 📦 Key Dependencies

| Package | Purpose |
|---|---|
| `react` v19 | UI framework |
| `react-router` v8 | Client-side routing |
| `tailwindcss` v4 | Utility-first CSS |
| `vite` v8 | Build tool and dev server |

---

## 🔐 Admin Account Setup

Admin credentials are seeded into the database using the backend seed script:

```bash
# From the root directory
npm run seed --prefix backend
```

Default credentials (configured via `backend/.env`):
```
Email:    admin@estara.com
Password: estara123
```

> ⚠️ Change these default credentials before deploying to production.
