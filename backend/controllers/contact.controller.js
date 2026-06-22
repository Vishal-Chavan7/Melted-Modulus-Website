import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import Contact from "../models/contact.model.js";
import { sendContactSubmissionEmail } from "../utils/contactEmailService.js";

const createContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  const contact = await Contact.create({
    name,
    email,
    subject,
    message,
  });

  try {
    await sendContactSubmissionEmail(contact);
  } catch (emailError) {
    console.error("Contact submission email failed:", emailError.message);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, contact, "Message sent successfully"));
});

export { createContact };
