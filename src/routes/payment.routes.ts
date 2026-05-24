import { Router } from "express";
import { initializePayment, webhookHandler } from "../controllers/payment.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/initialize", authenticate, initializePayment); // redundant -> create book has payment initialization; will later use for reinitialization of expired auth_url

router.post("/webhook", webhookHandler);

export default router;