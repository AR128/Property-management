import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user?._id ?? user?.id,
      email: user?.email,
      adminName: user?.adminName,
    },
    process.env.JWT_ACCESS_TOKEN,
    { expiresIn: "15m" },
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user?._id ?? user?.id,
      email: user?.email,
      adminName: user?.adminName,
    },
    process.env.JWT_REFRESH_TOKEN,
    { expiresIn: "7d" },
  );
};

export const generateTokenPair = (user) => ({
  accessToken: generateAccessToken(user),
  refreshToken: generateRefreshToken(user),
});
