import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  handleCancelOrder,
  handleCreateOrder,
  handleDeleteOrder,
  handleGetOrder,
  handleGetUserOrders,
} from '../controller/order.controller';
import { isAdmin } from '../middleware/adminHandler';

const orderRoutes = Router();

orderRoutes.post(
  '/create-order',
  authMiddleware,
  asyncHandler(handleCreateOrder),
);
orderRoutes.get('/:orderId', authMiddleware, asyncHandler(handleGetOrder));
orderRoutes.get(
  '/all/user-orders',
  authMiddleware,
  asyncHandler(handleGetUserOrders),
);
orderRoutes.post(
  '/cancel/:orderId',
  authMiddleware,
  asyncHandler(handleCancelOrder),
);
orderRoutes.delete(
  '/remove/:orderId',
  authMiddleware,
  isAdmin,
  asyncHandler(handleDeleteOrder),
);

export default orderRoutes;
