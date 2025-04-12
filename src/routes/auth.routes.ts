import { Router } from 'express';
import {
  handleRegister,
  handleLogin,
  handleForgotPassword,
  handleResetPassword,
} from '../controller/auth.controller';
import { asyncHandler } from '../middleware/asyncHandler';

const authRoutes = Router();

authRoutes.post('/register', asyncHandler(handleRegister));
authRoutes.post('/login', asyncHandler(handleLogin));
authRoutes.post('/forgot-password', asyncHandler(handleForgotPassword));
authRoutes.post('/reset-password/:token', asyncHandler(handleResetPassword));

export default authRoutes;
