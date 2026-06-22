import mongoose from "mongoose";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import CustomQuote from "../../models/customQuote.model.js";
import { sendQuoteStatusEmail } from "../../utils/quoteEmailService.js";

const getAllCustomQuotes = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;
  const { status, search } = req.query;

  const queryConditions = {};

  if (status) {
    queryConditions.status = status;
  }

  if (search) {
    queryConditions.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const [quotes, totalQuotes] = await Promise.all([
    CustomQuote.find(queryConditions).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    CustomQuote.countDocuments(queryConditions),
  ]);

  const totalPages = Math.ceil(totalQuotes / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        quotes,
        pagination: {
          totalQuotes,
          totalPages,
          currentPage: page,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      "Custom quotes fetched successfully",
    ),
  );
});

const getCustomQuoteById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid quote id");
  }

  const quote = await CustomQuote.findById(id);

  if (!quote) {
    throw new ApiError(404, "Custom quote not found");
  }

  return res.status(200).json(new ApiResponse(200, quote, "Custom quote fetched successfully"));
});

const updateCustomQuoteStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, quotedPrice, adminNotes } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid quote id");
  }

  const existingQuote = await CustomQuote.findById(id);

  if (!existingQuote) {
    throw new ApiError(404, "Custom quote not found");
  }

  if (existingQuote.status === status) {
    throw new ApiError(400, `Quote request is already ${status}`);
  }

  const updateData = { status };

  if (quotedPrice != null) {
    updateData.quotedPrice = quotedPrice;
  }

  if (adminNotes != null) {
    updateData.adminNotes = adminNotes;
  }

  const quote = await CustomQuote.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  try {
    await sendQuoteStatusEmail(quote, status);
  } catch (emailError) {
    console.error(`Custom quote ${status} email failed:`, emailError.message);
  }

  return res.status(200).json(new ApiResponse(200, quote, "Custom quote status updated successfully"));
});

const deleteCustomQuote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid quote id");
  }

  const quote = await CustomQuote.findByIdAndDelete(id);

  if (!quote) {
    throw new ApiError(404, "Custom quote not found");
  }

  return res.status(200).json(new ApiResponse(200, quote, "Custom quote deleted successfully"));
});

export { getAllCustomQuotes, getCustomQuoteById, updateCustomQuoteStatus, deleteCustomQuote };
