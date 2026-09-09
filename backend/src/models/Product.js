import mongoose from "mongoose";

const ProductStatus = { Active: "active", Sold: "sold", Hidden: "hidden" };
const propertyTypes = ["Apartment", "Independent house", "Villa", "Plot", "Commercial"];

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Product must belong to a seller"],
    },
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    propertyType: {
      type: String,
      required: [true, "Property type is required"],
      enum: propertyTypes,
    },
    purpose: { type: String, enum: ["sale", "rent"], default: "sale" },
    address: {
      line1: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      pincode: { type: String, required: true, match: [/^\d{6}$/, "Enter a valid 6-digit pincode"] },
    },
    bedrooms: { type: Number, min: 0, default: 0 },
    bathrooms: { type: Number, min: 0, default: 0 },
    areaSqFt: { type: Number, required: true, min: 1 },
    furnishing: { type: String, enum: ["Unfurnished", "Semi-furnished", "Furnished"], default: "Unfurnished" },
    parking: { type: Boolean, default: false },
    amenities: [{ type: String, trim: true, maxlength: 50 }],
    images: [
      {
        url: {
          type: String,
          required: [true, "Image URL is required"],
        },
        public_id: {
          type: String,
          required: [true, "Image public ID is required"],
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    isApproved: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(ProductStatus),
      default: ProductStatus.Active,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.index({ title: "text", "address.city": "text", propertyType: "text" });

export const Product = mongoose.model("Product", productSchema);
