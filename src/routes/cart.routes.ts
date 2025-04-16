import { Router } from 'express';
import {
  handleApplyCoupon,
  handleCreateCart,
  handleGetCart,
  handleRemoveCoupon,
} from '../controller/cart.controller';
import { asyncHandler } from '../middleware/asyncHandler';
import { authMiddleware } from '../middleware/authMiddleware';

const cartRoutes = Router();

cartRoutes.post('/create-cart', authMiddleware, asyncHandler(handleCreateCart));
cartRoutes.get('/:id', authMiddleware, asyncHandler(handleGetCart));
cartRoutes.post(
  '/apply-coupon',
  authMiddleware,
  asyncHandler(handleApplyCoupon),
);
cartRoutes.post(
  '/remove-coupon',
  authMiddleware,
  asyncHandler(handleRemoveCoupon),
);

export default cartRoutes;
