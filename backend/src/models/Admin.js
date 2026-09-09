import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    adminName: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [2, "Username must be at least 2 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
  },
  {
    timestamps: true,
  },
);

export const Admin = mongoose.model("Admin", adminSchema);
