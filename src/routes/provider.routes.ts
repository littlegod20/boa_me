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


// Register as a provider
router.post('/register', authenticate, registerAsProvider)

// Create a provider service
router.post('/', authenticate, createProviderService)

// Get all providers for a specific service
router.get('/service/:serviceId/providers', authenticate, getServiceProviders)

// Get a provider service by ID
router.get('/:providerServiceId', authenticate, getProviderServiceById)

// Get provider services with pagination/search
router.get('/', authenticate, getProviderServices)

// Update a provider service
router.patch('/:providerServiceId', authenticate, isAdmin, updateProviderService)

// Delete a provider service
router.delete('/:providerServiceId', authenticate, isAdmin, removeProviderService)

export default router
