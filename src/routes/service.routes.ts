import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { createService, getAllServices, getServiceById, updateService } from "../controllers/service.controller";
import { isAdmin } from "../middlewares/role.middleware";

const router = Router()

router.post('/', authenticate, isAdmin, createService)
router.get('/',  getAllServices)
router.get('/:serviceId', getServiceById)
router.patch('/:serviceId', authenticate, isAdmin, updateService)

export default router