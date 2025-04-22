import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { handleRegisterForNewsletter } from '../controller/newsletter.controller';

const newsletterRoutes = Router();

newsletterRoutes.post('/subscribe', asyncHandler(handleRegisterForNewsletter));

export default newsletterRoutes;
