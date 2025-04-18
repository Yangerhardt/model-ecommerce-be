import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import {
  handleCalculateShipping,
  handleValidateCep,
} from '../controller/shipping.controller';

const shippingRoutes = Router();

shippingRoutes.get('/:cep', asyncHandler(handleValidateCep));
shippingRoutes.post('/cost', asyncHandler(handleCalculateShipping));

export default shippingRoutes;
