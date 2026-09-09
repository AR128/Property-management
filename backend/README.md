# ⚙️ Estara — Backend API

The REST API powering the Estara Property Management System. Built with **Express.js 5**, **MongoDB**, and **Cloudinary** for image storage.

**Base URL (Production):** `https://property-management-lr1k.onrender.com`  
**Base URL (Local):** `http://localhost:3000`

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── index.js                  # App entry point — Express setup, middleware, CORS
│   ├── config/
│   │   ├── db.js                 # MongoDB connection via Mongoose
│   │   ├── cloudinaryConfig.js   # Cloudinary SDK configuration
│   │   └── seed.js               # Seeds the initial admin account
│   ├── controllers/
│   │   ├── userController.js     # Signup, login, dashboard, KYC verification
│   │   ├── propertyController.js # Property CRUD, seller consent, status toggle
│   │   └── adminController.js    # Admin data, property moderation
│   ├── middleware/
│   │   ├── auth.js               # JWT access token verification middleware
│   │   ├── upload.js             # Multer + Cloudinary storage configuration
│   │   └── validator.js          # express-validator rules for login endpoints
│   ├── models/
│   │   ├── User.js               # Client (buyer/seller) Mongoose schema
│   │   ├── Admin.js              # Admin Mongoose schema
│   │   └── Product.js            # Property listing Mongoose schema
│   ├── routes/
│   │   ├── clientRoutes.js       # All /user/* routes
│   │   └── adminRoutes.js        # All /admin/* routes
│   └── utils/
│       └── generateToken.js      # JWT access & refresh token generators
├── .env                          # Environment variables (gitignored)
├── .env.example                  # Environment variable template
├── .gitignore
└── package.json
```

---

## 🔌 API Reference

### Client Routes — `/user`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/user/signup` | ❌ | Register a new user |
| `POST` | `/user/login` | ❌ | Login and receive access token |
| `POST` | `/user/refresh` | 🍪 Cookie | Refresh access token using refresh token cookie |
| `GET` | `/user/dashboard` | ✅ | Get authenticated user's profile |
| `POST` | `/user/dashboard/verify` | ✅ | Submit KYC (Aadhaar, PAN, profile picture) |
| `GET` | `/user/dashboard/isverified` | ✅ | Check if user is KYC verified |
| `GET` | `/user/properties` | ✅ | Get all approved, active property listings |
| `POST` | `/user/seller/consent` | ✅ | Accept seller agreement and become a seller |
| `GET` | `/user/seller/properties` | ✅ | Get all properties created by the logged-in seller |
| `POST` | `/user/seller/properties` | ✅ | Create a new property listing (up to 8 images) |
| `DELETE` | `/user/seller/properties/:id` | ✅ | Delete a specific property |
| `PATCH` | `/user/seller/properties/:id/status` | ✅ | Toggle property visibility (active/hidden) |

### Admin Routes — `/admin`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/admin/login` | ❌ | Admin login |
| `POST` | `/admin/refresh` | 🍪 Cookie | Refresh admin access token |
| `GET` | `/admin/dashboard` | ✅ | Admin dashboard summary |
| `GET` | `/admin/dashboard/users` | ✅ | Get total user count |
| `GET` | `/admin/sellers` | ✅ | Get all registered sellers |
| `GET` | `/admin/buyers` | ✅ | Get all registered buyers |
| `GET` | `/admin/properties` | ✅ | Get all property listings |
| `PATCH` | `/admin/properties/:id/approve` | ✅ | Approve a property listing |
| `PATCH` | `/admin/properties/:id/reject` | ✅ | Reject / unpublish a property listing |
| `DELETE` | `/admin/properties/:id` | ✅ | Permanently delete a listing |

> **Auth Legend:** ✅ = Bearer token required in `Authorization` header | 🍪 = HttpOnly cookie required

---

## 🗄️ Database Models

### `Client` (User)
| Field | Type | Notes |
|---|---|---|
| `clientName` | String | Min 5 chars |
| `email` | String | Unique, validated |
| `password` | String | Bcrypt hashed, min 8 chars |
| `role` | `["buyer", "seller"]` | Defaults to `["buyer"]` |
| `isVerified` | Boolean | Set to `true` after KYC |
| `profilePicture` | `{ url, public_id }` | Cloudinary reference |
| `verificationDetails` | `{ aadhaarNumber, panNumber, verifiedAt }` | KYC data |

### `Product` (Property Listing)
| Field | Type | Notes |
|---|---|---|
| `seller` | ObjectId → Client | Required |
| `title` | String | 3–100 chars |
| `description` | String | Required |
| `price` | Number | Non-negative |
| `propertyType` | Enum | `Apartment`, `Independent house`, `Villa`, `Plot`, `Commercial` |
| `purpose` | Enum | `sale` or `rent` |
| `address` | `{ line1, city, state, pincode }` | 6-digit pincode validated |
| `bedrooms` | Number | Default 0 |
| `bathrooms` | Number | Default 0 |
| `areaSqFt` | Number | Required |
| `furnishing` | Enum | `Unfurnished`, `Semi-furnished`, `Furnished` |
| `parking` | Boolean | Default false |
| `amenities` | `[String]` | Max 50 chars each |
| `images` | `[{ url, public_id, isPrimary }]` | Up to 8, via Cloudinary |
| `isApproved` | Boolean | Default `false`, set by admin |
| `status` | Enum | `active`, `sold`, `hidden` |

### `Admin`
| Field | Type | Notes |
|---|---|---|
| `adminName` | String | Required |
| `email` | String | Unique |
| `password` | String | Bcrypt hashed |

---

## 🔐 Authentication Flow

```
Login → Access Token (short-lived) + Refresh Token (HttpOnly cookie)
          ↓
    API calls with Authorization: Bearer <accessToken>
          ↓
    Token expires → POST /refresh with cookie → New access token
          ↓
    Refresh token expired → Redirect to login
```

---

## 🌍 Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
PORT=3000
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174

DATABASE_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/?appName=...

JWT_ACCESS_TOKEN=<your_strong_secret>
JWT_REFRESH_TOKEN=<your_strong_secret>

CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>

# Used by seed.js to create the initial admin account
ADMINNAME=admin
EMAIL=admin@estara.com
PASSWORD=estara123
```

> ⚠️ For production, set `ALLOWED_ORIGINS` to your deployed frontend URLs (comma-separated, no spaces).

---

## 📦 Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `nodemon src/index.js` | Start with hot-reload |
| `npm start` | `node src/index.js` | Start in production mode |
| `npm run seed` | `node src/config/seed.js` | Seed the admin account |

---

## 📦 Key Dependencies

| Package | Purpose |
|---|---|
| `express` v5 | Web framework |
| `mongoose` | MongoDB ODM |
| `jsonwebtoken` | JWT generation & verification |
| `bcryptjs` | Password hashing |
| `cloudinary` | Cloud image storage |
| `multer` | Multipart form / file upload handling |
| `express-validator` | Input validation rules |
| `cors` | Cross-origin resource sharing |
| `cookie-parser` | HttpOnly cookie parsing |
| `dotenv` | Environment variable loading |
| `nodemon` | Dev hot-reload |
