import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  handleCreateOrder,
  handleGetOrder,
  handleGetUserOrders,
} from '../controller/order.controller';

const orderRoutes = Router();

orderRoutes.post(
  '/create-order',
  authMiddleware,
  asyncHandler(handleCreateOrder),
);
orderRoutes.get('/:orderId', authMiddleware, asyncHandler(handleGetOrder));
orderRoutes.get(
  '/user-orders',
  authMiddleware,
  asyncHandler(handleGetUserOrders),
);

export default orderRoutes;
