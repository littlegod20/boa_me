import { Router } from "express";
import { initializePayment, webhookHandler } from "../controllers/payment.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { initializePaymentSchema } from "../validators/payment.validator";

const router = Router();

router.post("/initialize", authenticate, validate(initializePaymentSchema), initializePayment); // redundant -> create book has payment initialization; will later use for reinitialization of expired auth_url

router.post("/webhook", webhookHandler);

export default router;