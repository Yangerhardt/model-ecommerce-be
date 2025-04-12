import { Router } from 'express';
import { handleCreateCart, handleGetCart } from '../controller/cart.controller';
import { asyncHandler } from '../middleware/asyncHandler';
import { authMiddleware } from '../middleware/authMiddleware';

const cartRoutes = Router();

cartRoutes.post('/create-cart', authMiddleware, asyncHandler(handleCreateCart));
cartRoutes.get('/:id', authMiddleware, asyncHandler(handleGetCart));

export default cartRoutes;
