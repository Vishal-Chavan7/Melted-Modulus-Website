import express from "express";
import { createCustomQuote } from "../controllers/customQuote.controller.js";
import validateMiddleware from "../middlewares/validateMiddleware.js";
import { createCustomQuoteSchema } from "../validations/customQuote.validation.js";

const router = express.Router();

router
  .route("/custom-quotes")
  .post(validateMiddleware(createCustomQuoteSchema), createCustomQuote);

export default router;
