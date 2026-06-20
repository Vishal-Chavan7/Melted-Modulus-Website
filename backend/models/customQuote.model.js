import mongoose from "mongoose";

const customQuoteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    material: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "quoted", "closed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const CustomQuote = mongoose.model("CustomQuote", customQuoteSchema);

export default CustomQuote;
