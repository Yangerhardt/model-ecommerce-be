import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { handleCreateCart } from '../controller/cart.controller';

const cartRoutes = Router();

cartRoutes.post('/create-cart', asyncHandler(handleCreateCart));

export default cartRoutes;
