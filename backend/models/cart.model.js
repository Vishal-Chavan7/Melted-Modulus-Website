import mongoose from "mongoose";

const cartSchema = mongoose.Schema(
  {
    user: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    items: [
      {
        product: {
          ref: "Product",
          type: mongoose.Schema.Types.ObjectId,
          required: true,

        },
        quantity:{
            type: Number,
            required: true,
            min: 1,
            default: 1
        }
      },
    ],
  },
  { timestamps: true },
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
