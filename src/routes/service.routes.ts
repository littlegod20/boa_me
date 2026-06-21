import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { createService, getAllServices, getServiceById, removeService, updateService } from "../controllers/service.controller";
import { isAdmin } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createServiceSchema, updateServiceSchema } from "../validators/service.validator";

const router = Router()

router.post('/', authenticate, isAdmin, validate(createServiceSchema), createService)
router.get('/', authenticate,  getAllServices)
router.get('/:serviceId', authenticate, getServiceById)
router.patch('/:serviceId', authenticate, isAdmin, validate(updateServiceSchema), updateService)
router.delete('/:serviceId', authenticate, isAdmin, removeService)

export default router