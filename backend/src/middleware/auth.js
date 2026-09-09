import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ success: false, message: "Access denied. No token provided." });
  }

  try {
    const verifiedData = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    req.user = verifiedData;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token." });
  }
};

export default verifyToken;
