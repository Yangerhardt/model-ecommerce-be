import { Router } from 'express';
import {
  handleCreateOrUpdateCoupon,
  handleDeleteCoupon,
  handleGetCoupon,
} from '../controller/coupon.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/asyncHandler';
import { isAdmin } from '../middleware/adminHandler';

const couponRoutes = Router();

couponRoutes.get('/:code', authMiddleware, asyncHandler(handleGetCoupon));
couponRoutes.post(
  '/',
  authMiddleware,
  isAdmin,
  asyncHandler(handleCreateOrUpdateCoupon),
);
couponRoutes.delete(
  '/:code',
  authMiddleware,
  isAdmin,
  asyncHandler(handleDeleteCoupon),
);

export default couponRoutes;
