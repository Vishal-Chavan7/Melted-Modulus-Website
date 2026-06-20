import express from "express";
import { createContact } from "../controllers/contact.controller.js";
import validateMiddleware from "../middlewares/validateMiddleware.js";
import { createContactSchema } from "../validations/contact.validation.js";

const router = express.Router();

router
  .route("/contacts")
  .post(validateMiddleware(createContactSchema), createContact);

export default router;
