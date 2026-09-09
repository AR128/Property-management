import bcrypt from "bcryptjs";
import { generateTokenPair } from "../utils/generateToken.js";
import { Client } from "../models/User.js";
import cloudinary from "../config/cloudinaryConfig.js";

export const signupClient = async (req, res) => {
  const { clientName, email, password } = req.body;
  try {
    if (!clientName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Give all the details" });
    }

    const existingUser = await Client.findOne({
      $or: [{ email }, { clientName }],
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Username or email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Client.create({
      clientName,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
    });
  } catch (error) {
    console.error("Signup server error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const loginClient = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Give all the details" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await Client.findOne({ email: normalizedEmail });

    if (!user) {
      return res
        .status(401)
        .json({
          success: false,
          message: "No client account exists for this email. Please sign up first or use the email you registered with.",
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Password credentials." });
    }

    const { accessToken, refreshToken } = generateTokenPair(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, //have to change to true when in production
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token: accessToken,
    });
  } catch (error) {
    console.error("Server error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { clientName, aadhaarNumber, panNumber } = req.body;

    if (!clientName || clientName.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Username must be at least 5 characters long.",
      });
    }

    if (!/^[2-9]\d{11}$/.test(aadhaarNumber || "")) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid Aadhaar number.",
      });
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test((panNumber || "").toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid PAN number.",
      });
    }

    const updates = {
      clientName: clientName.trim(),
      isVerified: true,
      "verificationDetails.aadhaarNumber": aadhaarNumber,
      "verificationDetails.panNumber": panNumber.toUpperCase(),
      "verificationDetails.verifiedAt": new Date(),
    };

    if (req.file) {
      const image = await uploadToCloudinary(req.file);
      if (image) {
        const currentUser = await Client.findById(req.user.id).select(
          "profilePicture",
        );

        if (currentUser?.profilePicture?.public_id) {
          await cloudinary.uploader
            .destroy(currentUser.profilePicture.public_id)
            .catch(() => {});
        }

        updates.profilePicture = image;
      }
    }

    const updatedUser = await Client.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true, select: "-password" },
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({
      success: true,
      message: "Identity verified successfully",
      isVerified: updatedUser.isVerified,
      user: updatedUser,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const verification = async (req, res) => {
  try {
    const user = await Client.findById(req.user.id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const verify = user?.isVerified;
    res.status(200).json({
      success: true,
      verify,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const uploadToCloudinary = async (file) => {
  if (!file) return null;
  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  const res = await cloudinary.uploader.upload(dataUri, { folder: "students" });
  return { url: res.secure_url, public_id: res.public_id };
};

export const getDashboard = (req, res) => {
  Client.findById(req.user.id)
    .select("-password")
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Welcome to Estara's private dashboard!",
        user,
      });
    })
    .catch((error) => {
      console.error("Dashboard server error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    });
};

