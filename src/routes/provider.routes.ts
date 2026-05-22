import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/role.middleware";
import { 
    createProviderService, 
    getProviderServiceById, 
    getProviderServices, 
    getServiceProviders, 
    updateProviderService, 
    removeProviderService,
    registerAsProvider
} from "../controllers/provider.controller";

const router = Router()



router.post('/register', authenticate, registerAsProvider)

router.post('/', authenticate, createProviderService)

router.get('/service/:serviceId/providers', authenticate, getServiceProviders)

router.get('/:providerServiceId', authenticate, getProviderServiceById)

router.get('/', authenticate, getProviderServices)

router.patch('/:providerServiceId', authenticate, isAdmin, updateProviderService)

router.delete('/:providerServiceId', authenticate, isAdmin, removeProviderService)

export default router
