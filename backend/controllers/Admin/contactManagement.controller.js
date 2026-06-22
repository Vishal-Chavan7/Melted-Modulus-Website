import mongoose from "mongoose";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import Contact from "../../models/contact.model.js";
import { sendContactRepliedEmail } from "../../utils/contactEmailService.js";

const getAllContacts = asyncHandler(async (req, res) => {
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
      { message: { $regex: search, $options: "i" } },
    ];
  }

  const [contacts, totalContacts] = await Promise.all([
    Contact.find(queryConditions).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Contact.countDocuments(queryConditions),
  ]);

  const totalPages = Math.ceil(totalContacts / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        contacts,
        pagination: {
          totalContacts,
          totalPages,
          currentPage: page,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      "Contacts fetched successfully",
    ),
  );
});

const getContactById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid contact id");
  }

  const contact = await Contact.findById(id);

  if (!contact) {
    throw new ApiError(404, "Contact message not found");
  }

  return res.status(200).json(new ApiResponse(200, contact, "Contact fetched successfully"));
});

const updateContactStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, adminReply } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid contact id");
  }

  const existingContact = await Contact.findById(id);

  if (!existingContact) {
    throw new ApiError(404, "Contact message not found");
  }

  if (existingContact.status === status) {
    throw new ApiError(400, `Contact message is already ${status}`);
  }

  const updateData = { status };

  if (adminReply != null) {
    updateData.adminReply = adminReply;
  }

  const contact = await Contact.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (status === "replied") {
    try {
      await sendContactRepliedEmail(contact);
    } catch (emailError) {
      console.error("Contact replied email failed:", emailError.message);
    }
  }

  return res.status(200).json(new ApiResponse(200, contact, "Contact status updated successfully"));
});

const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid contact id");
  }

  const contact = await Contact.findByIdAndDelete(id);

  if (!contact) {
    throw new ApiError(404, "Contact message not found");
  }

  return res.status(200).json(new ApiResponse(200, contact, "Contact deleted successfully"));
});

export { getAllContacts, getContactById, updateContactStatus, deleteContact };
