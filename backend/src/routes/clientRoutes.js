import { Router } from "express";
import jwt from "jsonwebtoken";
import {
  loginClient,
  getDashboard,
  signupClient,
  verifyUser,
  verification,
} from "../controllers/userController.js";
import verifyToken from "../middleware/auth.js";
import { upload, propertyUpload } from "../middleware/upload.js";
import { clientLoginRules, validateInputs } from "../middleware/validator.js";
import { generateAccessToken } from "../utils/generateToken.js";
import {
  becomeSeller,
  createProperty,
  getProperties,
  getSellerProperties,
  deleteProperty,
  togglePropertyStatus,
} from "../controllers/propertyController.js";

const clientRouter = Router();

// Signup Endpoint
clientRouter.post("/signup", signupClient);

// Login Endpoint
clientRouter.post("/login", clientLoginRules, validateInputs, loginClient);

// Dashboard Endpoint
clientRouter.get("/dashboard", verifyToken, getDashboard);

// Profile Verification
clientRouter.post(
  "/dashboard/verify",
  verifyToken,
  upload.single("profilePicture"),
  verifyUser,
);

// isVerified status check
clientRouter.get("/dashboard/isverified", verifyToken, verification);

// Property & Seller Endpoints
clientRouter.get("/properties", verifyToken, getProperties);
clientRouter.post("/seller/consent", verifyToken, becomeSeller);
clientRouter.get("/seller/properties", verifyToken, getSellerProperties);
clientRouter.post(
  "/seller/properties",
  verifyToken,
  propertyUpload.array("images", 8),
  createProperty,
);
clientRouter.delete("/seller/properties/:id", verifyToken, deleteProperty);
clientRouter.patch(
  "/seller/properties/:id/status",
  verifyToken,
  togglePropertyStatus,
);

// Refresh Endpoint
clientRouter.post("/refresh", (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "No refresh token found.",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);

    const newAccessToken = generateAccessToken({
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
    });

    return res.status(200).json({
      success: true,
      token: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Refresh token expired or invalid.",
    });
  }
});

export default clientRouter;
