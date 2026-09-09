import { Router } from "express";
import jwt from "jsonwebtoken";
import {
  getDashboard,
  loginAdmin,
  userCount,
  getAdminProperties,
  approveProperty,
  rejectProperty,
  getSellers,
  getBuyers,
  deleteAdminProperty,
} from "../controllers/adminController.js";
import { generateAccessToken } from "../utils/generateToken.js";
import verifyToken from "../middleware/auth.js";
import { adminLoginRules, validateInputs } from "../middleware/validator.js";

const adminRouter = Router();

adminRouter.post("/login", adminLoginRules, validateInputs, loginAdmin);
adminRouter.get("/dashboard", verifyToken, getDashboard);
adminRouter.get("/dashboard/users", verifyToken, userCount);

// Panel 1 & Panel 3 Admin Data Endpoints
adminRouter.get("/sellers", verifyToken, getSellers);
adminRouter.get("/buyers", verifyToken, getBuyers);

// Panel 2 Property moderation endpoints
adminRouter.get("/properties", verifyToken, getAdminProperties);
adminRouter.patch("/properties/:id/approve", verifyToken, approveProperty);
adminRouter.patch("/properties/:id/reject", verifyToken, rejectProperty);
adminRouter.delete("/properties/:id", verifyToken, deleteAdminProperty);

adminRouter.post("/refresh", (req, res) => {
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

export default adminRouter;
