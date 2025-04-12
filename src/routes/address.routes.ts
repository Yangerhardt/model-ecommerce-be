import { Router } from 'express';
import {
  handleGetUserAddress,
  handleUpsertUserAddress,
} from '../controller/address.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/asyncHandler';

const addressRoutes = Router();

addressRoutes.get('/', authMiddleware, asyncHandler(handleGetUserAddress));
addressRoutes.post('/new-address', authMiddleware, asyncHandler(handleUpsertUserAddress));

export default addressRoutes;
