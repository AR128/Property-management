import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin.js";

const hashPassword = async (password) => await bcrypt.hash(password, 10);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    console.log(`✅ MongoDB Connected`);

    const existingAdmin = await Admin.findOne({ email: process.env.EMAIL });
    if (!existingAdmin) {
      const newAdmin = new Admin({
        adminName: process.env.ADMINNAME || "admin",
        email: process.env.EMAIL,
        password: await hashPassword(process.env.PASSWORD),
      });

      const savedUser = await newAdmin.save();
      console.log("Admin seeded successfully!");
    } else {
      console.log("Admin already exists in the database.");
    }
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
