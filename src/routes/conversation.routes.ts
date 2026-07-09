import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { validate, validateParams, validateQuery } from "../middlewares/validate.middleware";
import {
    createConversation,
    getConversationMessages,
    getUserConversations,
} from "../controllers/conversation.controller";
import {
    conversationIdParamSchema,
    createConversationSchema,
    paginationQuerySchema,
} from "../validators/conversation.validator";

const router = Router();

router.post("/", authenticate, validate(createConversationSchema), createConversation);
router.get("/", authenticate, getUserConversations);
router.get(
    "/:conversationId/messages",
    authenticate,
    validateParams(conversationIdParamSchema),
    // validateQuery(paginationQuerySchema),
    getConversationMessages
);

export default router;
