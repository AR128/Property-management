import cloudinary from "../config/cloudinaryConfig.js";
import { Product } from "../models/Product.js";
import { Client } from "../models/User.js";

const uploadImage = async (file) => {
  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, { folder: "estara/properties" });
  return { url: result.secure_url, public_id: result.public_id };
};

const sellerCanList = async (id) => {
  const seller = await Client.findById(id).select("role isVerified");
  return seller?.isVerified && seller.role.includes("seller");
};

export const becomeSeller = async (req, res) => {
  try {
    const { consentAgreed } = req.body;
    if (consentAgreed === false) {
      return res.status(400).json({ success: false, message: "You must accept the seller agreement consent to become a seller." });
    }

    const user = await Client.findById(req.user.id).select("role isVerified clientName email profilePicture");
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: "Complete profile verification before becoming a seller." });
    }

    if (!user.role.includes("seller")) {
      user.role.push("seller");
      await user.save();
    }

    return res.json({
      success: true,
      message: "Congratulations! You are now registered as a seller on Estara.",
      role: user.role,
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to update seller role." });
  }
};

export const createProperty = async (req, res) => {
  const uploaded = [];
  try {
    if (!(await sellerCanList(req.user.id))) return res.status(403).json({ success: false, message: "Only verified sellers can publish properties." });
    const { title, description, price, propertyType, purpose, addressLine1, city, state, pincode, bedrooms, bathrooms, areaSqFt, furnishing, parking } = req.body;
    if (!title || !description || !price || !propertyType || !addressLine1 || !city || !state || !pincode || !areaSqFt || !req.files?.length) {
      return res.status(400).json({ success: false, message: "Complete all required property details and add at least one image." });
    }
    const images = await Promise.all(req.files.map(async (file, index) => ({ ...(await uploadImage(file)), isPrimary: index === 0 })));
    uploaded.push(...images);
    const amenities = (req.body.amenities || "").split(",").map((item) => item.trim()).filter(Boolean).slice(0, 12);
    const property = await Product.create({
      seller: req.user.id, title, description, price: Number(price), propertyType, purpose: purpose || "sale",
      address: { line1: addressLine1, city, state, pincode }, bedrooms: Number(bedrooms || 0), bathrooms: Number(bathrooms || 0),
      areaSqFt: Number(areaSqFt), furnishing: furnishing || "Unfurnished", parking: parking === "true" || parking === true, amenities, images,
      isApproved: false,
    });
    return res.status(201).json({
      success: true,
      message: "Property submitted successfully! It will become visible on the marketplace once approved by the Admin.",
      property,
    });
  } catch (error) {
    await Promise.all(uploaded.map((image) => cloudinary.uploader.destroy(image.public_id).catch(() => {})));
    return res.status(400).json({ success: false, message: error.message || "Unable to publish property." });
  }
};

export const getProperties = async (req, res) => {
  try {
    const properties = await Product.find({ status: "active", isApproved: true })
      .populate("seller", "clientName email profilePicture verificationDetails")
      .sort({ createdAt: -1 });
    res.json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch properties." });
  }
};

export const getSellerProperties = async (req, res) => {
  try {
    if (!(await sellerCanList(req.user.id))) return res.status(403).json({ success: false, message: "Seller access is required." });
    const properties = await Product.find({ seller: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch seller properties." });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const property = await Product.findOne({ _id: req.params.id, seller: req.user.id });
    if (!property) return res.status(404).json({ success: false, message: "Property not found or unauthorized." });

    if (property.images && property.images.length > 0) {
      await Promise.all(property.images.map((img) => cloudinary.uploader.destroy(img.public_id).catch(() => {})));
    }

    await Product.deleteOne({ _id: property._id });
    return res.json({ success: true, message: "Property deleted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete property." });
  }
};

export const togglePropertyStatus = async (req, res) => {
  try {
    const property = await Product.findOne({ _id: req.params.id, seller: req.user.id });
    if (!property) return res.status(404).json({ success: false, message: "Property not found or unauthorized." });

    property.status = property.status === "active" ? "sold" : "active";
    await property.save();

    return res.json({ success: true, message: `Property status updated to ${property.status}.`, status: property.status });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update property status." });
  }
};
