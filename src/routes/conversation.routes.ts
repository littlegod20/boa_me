import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
    createConversation,
    getConversationMessages,
    getUserConversations,
} from "../controllers/conversation.controller";

const router = Router();

router.post("/", authenticate, createConversation);
router.get("/", authenticate, getUserConversations);
router.get("/:conversationId/messages", authenticate, getConversationMessages);

export default router;
