import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import "dotenv/config";
import adminRouter from "./routes/adminRoutes.js";
import clientRouter from "./routes/clientRoutes.js";
import connectDB from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("Welcome to Estara Backend API");
});

app.use("/admin", adminRouter);
app.use("/user", clientRouter); // have to implement https://share.google/aimode/2g6v6yZQNyTRLHpCr && https://chatgpt.com/s/t_6a86aa2b43dc8191bfd4bc4646a94245

app.listen(PORT, () => {
  console.log(`Estara Backend server listening on port ${PORT}`);
});
