import mongoose from "mongoose";

const UserRole = {
  Buyer: "buyer",
  Seller: "seller",
};

const userSchema = new mongoose.Schema(
  {
    profilePicture: {
      url: { type: String },
      public_id: { type: String },
    },
    clientName: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [5, "Username must be at least 5 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    role: {
      type: [String],
      enum: Object.values(UserRole),
      default: [UserRole.Buyer],
    },
    isVerified: {
      type: Boolean,
      default: false, // Boolean fields do not require enum validation
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    verificationDetails: {
      aadhaarNumber: {
        type: String,
      },
      panNumber: {
        type: String,
        uppercase: true,
        trim: true,
        match: [
          /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
          "Please provide a valid PAN number",
        ],
      },
      verifiedAt: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  },
);

export const Client = mongoose.model("Client", userSchema);
