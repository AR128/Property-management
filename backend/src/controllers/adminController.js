import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin.js";
import { generateTokenPair } from "../utils/generateToken.js";
import { Client } from "../models/User.js";
import { Product } from "../models/Product.js";
import cloudinary from "../config/cloudinaryConfig.js";

export const loginAdmin = async (req, res) => {
  const { adminName, email, password } = req.body;

  try {
    if (!adminName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Give all the details" });
    }

    const user = await Admin.findOne({ adminName, email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid User credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Password." });
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

export const userCount = async (req, res) => {
  try {
    const count = await Client.countDocuments();
    return res.status(200).json({ success: true, count });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getDashboard = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Estara's private dashboard!",
    user: req.user,
  });
};

export const getSellers = async (req, res) => {
  try {
    const sellers = await Client.find({ role: "seller" }).select("-password").sort({ createdAt: -1 });

    const sellersWithListings = await Promise.all(
      sellers.map(async (seller) => {
        const sellerObj = seller.toObject();
        const properties = await Product.find({ seller: seller._id }).sort({ createdAt: -1 });
        sellerObj.properties = properties;
        return sellerObj;
      })
    );

    return res.status(200).json({
      success: true,
      sellers: sellersWithListings,
    });
  } catch (error) {
    console.error("Admin fetch sellers error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch sellers list." });
  }
};

export const getBuyers = async (req, res) => {
  try {
    const buyers = await Client.find().select("-password").sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      buyers,
    });
  } catch (error) {
    console.error("Admin fetch buyers error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch customers/buyers list." });
  }
};

export const getAdminProperties = async (req, res) => {
  try {
    const properties = await Product.find()
      .populate("seller", "clientName email profilePicture isVerified verificationDetails role createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      properties,
    });
  } catch (error) {
    console.error("Admin fetch properties error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch property listings for admin." });
  }
};

export const approveProperty = async (req, res) => {
  try {
    const property = await Product.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found." });
    }

    property.isApproved = true;
    property.status = "active";
    await property.save();

    return res.status(200).json({
      success: true,
      message: "Property approved successfully. It is now live on the buyer dashboard.",
      property,
    });
  } catch (error) {
    console.error("Approve property error:", error);
    return res.status(500).json({ success: false, message: "Failed to approve property." });
  }
};

export const rejectProperty = async (req, res) => {
  try {
    const property = await Product.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found." });
    }

    property.isApproved = false;
    await property.save();

    return res.status(200).json({
      success: true,
      message: "Property listing rejected / unpublished.",
      property,
    });
  } catch (error) {
    console.error("Reject property error:", error);
    return res.status(500).json({ success: false, message: "Failed to reject property." });
  }
};

export const deleteAdminProperty = async (req, res) => {
  try {
    const property = await Product.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found." });
    }

    if (property.images && property.images.length > 0) {
      await Promise.all(property.images.map((img) => cloudinary.uploader.destroy(img.public_id).catch(() => {})));
    }

    await Product.deleteOne({ _id: property._id });

    return res.status(200).json({
      success: true,
      message: "Property deleted permanently by Admin.",
    });
  } catch (error) {
    console.error("Delete property error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete property." });
  }
};
