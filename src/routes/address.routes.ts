import { Router } from 'express';
import {
  handleDeleteUserAddress,
  handleGetUserAddress,
  handleUpsertUserAddress,
} from '../controller/address.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/asyncHandler';
import { isAdmin } from '../middleware/adminHandler';

const addressRoutes = Router();

addressRoutes.get('/', authMiddleware, asyncHandler(handleGetUserAddress));
addressRoutes.post(
  '/new-address',
  authMiddleware,
  asyncHandler(handleUpsertUserAddress),
);
addressRoutes.delete(
  '/:userId',
  authMiddleware,
  isAdmin,
  handleDeleteUserAddress,
);

export default addressRoutes;
