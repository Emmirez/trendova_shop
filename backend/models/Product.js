import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Tracksuits", "Couture", "Footwear", "Accessories", "Gadgets"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    badge: {
      type: String,
      enum: ["New", "Sale", "Bestseller", "Limited", "Exclusive", null],
      default: null,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
    },
    hoverImage: String,
    colors: [String],
    sizes: [String],
    tags: [String],
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
