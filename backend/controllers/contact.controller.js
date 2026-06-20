import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import Contact from "../models/contact.model.js";

const createContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  const contact = await Contact.create({
    name,
    email,
    subject,
    message,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, contact, "Message sent successfully"));
});

export { createContact };
