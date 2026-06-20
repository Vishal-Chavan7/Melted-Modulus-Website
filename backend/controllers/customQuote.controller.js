import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import CustomQuote from "../models/customQuote.model.js";

const createCustomQuote = asyncHandler(async (req, res) => {
  const { name, email, phone, quantity, description, material, color } = req.body;

  const quote = await CustomQuote.create({
    name,
    email,
    phone,
    quantity,
    description,
    material,
    color,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, quote, "Custom quote request submitted successfully"));
});

export { createCustomQuote };
