import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    user: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    material:{
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    category: {
      ref: "Category",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    inventoryQuantity: {
      type: Number,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

productSchema.index({
  category: 1,
  isActive: 1,
});

productSchema.index({
  name: "text",
  description: "text",
});

productSchema.index({
  createdAt: -1,
});

const Product = mongoose.model("Product", productSchema);

export default Product;
