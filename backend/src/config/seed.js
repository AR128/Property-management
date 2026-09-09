import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Admin } from "../models/Admin.js";

async function passwordHashing(password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

async function seedAdmin() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.DATABASE_URL);

    console.log("Seeding admin user...");

    await Admin.deleteMany({});

    const hashedPassword = await passwordHashing(process.env.PASSWORD);

    const adminSeed = {
      adminName: process.env.ADMINNAME,
      email: process.env.EMAIL,
      password: hashedPassword,
    };

    const inserted = await Admin.create(adminSeed);

    console.log("Inserted admin user:", inserted);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Admin seed failed:");
    console.error(error);

    try {
      await mongoose.disconnect();
    } catch (error) {
      console.log(error);
    }

    process.exit(1);
  }
}

seedAdmin();
