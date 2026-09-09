# 🏡 Estara — Client Portal

The buyer and seller-facing frontend for the Estara Property Management System. Built with **React 19**, **React Router**, **Tailwind CSS**, and **Vite**.

**Live URL:** [estara-property.vercel.app](https://estara-property.vercel.app)  
**Local URL:** `http://localhost:5173`

---

## 📁 Project Structure

```
client/
├── public/
├── src/
│   ├── main.jsx                        # React app entry point with router setup
│   ├── App.jsx                         # Root component / route definitions
│   ├── App.css                         # Global base styles
│   ├── config/
│   │   └── api.js                      # API base URL (reads from VITE_API_BASE_URL)
│   ├── utils/
│   │   └── tokenStorage.js             # JWT token management + fetchWithAuth helper
│   ├── components/
│   │   ├── Login.jsx                   # Login form
│   │   ├── Signup.jsx                  # Registration form
│   │   ├── VerificationForm.jsx        # KYC identity verification form
│   │   ├── ConsentModal.jsx            # Seller consent agreement modal
│   │   ├── PropertyDetailModal.jsx     # Full property details view modal
│   │   ├── ProtectedRoute.jsx          # Auth guard for private routes
│   │   └── seller/
│   │       ├── Dashboard.jsx           # Seller's own listings management view
│   │       └── Items.jsx               # New property listing creation form
│   ├── pages/
│   │   ├── Dashboard.jsx               # Main buyer dashboard (browse & filter listings)
│   │   └── Seller.jsx                  # Seller section layout + access check
├── .env                                # Environment variables (gitignored)
├── .env.example                        # Environment variable template
├── vercel.json                         # Vercel SPA rewrite rules
├── vite.config.js
└── package.json
```

---

## 🗺️ Page & Route Map

| Route | Component | Auth | Description |
|---|---|---|---|
| `/` | Redirects | ❌ | Redirects to `/login` |
| `/login` | `Login.jsx` | ❌ | User login page |
| `/signup` | `Signup.jsx` | ❌ | New user registration |
| `/dashboard` | `Dashboard.jsx` | ✅ | Browse all approved property listings |
| `/dashboard/verify` | `VerificationForm.jsx` | ✅ | KYC identity verification |
| `/seller` | `Seller.jsx` | ✅ Seller | Seller section layout & access guard |
| `/seller/dashboard` | `seller/Dashboard.jsx` | ✅ Seller | View and manage own property listings |
| `/seller/add` | `seller/Items.jsx` | ✅ Seller | Create a new property listing |

---

## 🧩 Component Reference

### Pages

#### `Dashboard.jsx`
The main buyer experience. Fetches all approved, active listings from the API and renders them in a filterable, searchable grid.
- **Filters:** Property type (Apartment, Villa, Plot, etc.), Purpose (Sale / Rent)
- **Search:** Full-text search by title or location
- **Modals:** Opens `PropertyDetailModal` on card click
- **Consent Flow:** Triggers `ConsentModal` for users wanting to become sellers

#### `Seller.jsx`
Layout wrapper for all `/seller/*` routes. Verifies the user has the `seller` role before rendering child routes. Redirects non-sellers back to `/dashboard`.

---

### Components

#### `Login.jsx`
Email + password login form. On success, stores the access token via `tokenStorage` and navigates to `/dashboard`.

#### `Signup.jsx`
Registration form collecting name, email, and password. Redirects to login on success.

#### `VerificationForm.jsx`
KYC identity form with:
- Full name, Aadhaar number (12 digits), PAN number (10 chars)
- Profile photo upload (preview + Cloudinary upload via FormData)
- Client-side format validation for Aadhaar and PAN

#### `ConsentModal.jsx`
Modal that presents the seller agreement terms. User must check a confirmation box before submitting. On success, upgrades the user's role to include `seller`.

#### `PropertyDetailModal.jsx`
Full-screen modal displaying all property details including image gallery, address, specifications (beds, baths, area), amenities list, price, and seller info.

#### `ProtectedRoute.jsx`
Wraps private routes. Checks for a valid access token; if missing or expired, attempts a silent refresh. On failure, redirects to `/login`.

#### `seller/Dashboard.jsx`
Displays all properties created by the logged-in seller in a card layout. Supports:
- **Toggle Status** — Switch listing between `active` and `hidden`
- **Delete Listing** — Permanently removes the property after confirmation

#### `seller/Items.jsx`
Multi-field property creation form including:
- Basic info: title, description, price, type, purpose
- Location: address line, city, state, pincode
- Specs: bedrooms, bathrooms, area, furnishing, parking
- Amenities: multi-select checkboxes (pool, gym, security, etc.)
- Images: upload up to 8 photos with previews

---

## 🔑 Token Management (`utils/tokenStorage.js`)

| Export | Description |
|---|---|
| `getAccessToken()` | Read token from `sessionStorage` |
| `setAccessToken(token)` | Store token in `sessionStorage` |
| `clearAccessToken()` | Remove token from `sessionStorage` |
| `decodeToken(token)` | Decode JWT payload |
| `isAccessTokenExpired(token)` | Check if token is within 30s of expiry |
| `refreshAccessToken()` | Call `/user/refresh` using the HttpOnly cookie |
| `fetchWithAuth(url, options)` | Drop-in `fetch` wrapper that auto-attaches the Bearer token and silently refreshes if expired |

---

## 🌍 Environment Variables

```env
# client/.env
VITE_API_BASE_URL=http://localhost:3000
```

For production (Vercel), set `VITE_API_BASE_URL` to your deployed backend URL in Vercel's environment variable settings.

---

## 📦 Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server on port 5173 |
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
