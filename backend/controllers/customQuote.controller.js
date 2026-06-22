import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import CustomQuote from "../models/customQuote.model.js";
import { sendQuoteSubmissionEmail } from "../utils/quoteEmailService.js";

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

  try {
    await sendQuoteSubmissionEmail(quote);
  } catch (emailError) {
    console.error("Custom quote submission email failed:", emailError.message);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, quote, "Custom quote request submitted successfully"));
});

export { createCustomQuote };
