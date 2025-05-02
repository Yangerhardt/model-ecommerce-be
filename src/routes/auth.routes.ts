import { Router } from 'express';
import {
  handleRegister,
  handleLogin,
  handleForgotPassword,
  handleResetPasswordWithToken,
  handlePromoteUser,
  handleGetAllUsers,
  handleDeleteUser,
  handleChangePassword,
} from '../controller/auth.controller';
import { asyncHandler } from '../middleware/asyncHandler';
import { authMiddleware } from '../middleware/authMiddleware';
import { isAdmin } from '../middleware/adminHandler';

const authRoutes = Router();

authRoutes.post('/register', asyncHandler(handleRegister));
authRoutes.post('/login', asyncHandler(handleLogin));
authRoutes.post('/forgot-password', asyncHandler(handleForgotPassword));
authRoutes.post(
  '/reset-password/:token',
  asyncHandler(handleResetPasswordWithToken),
);
authRoutes.post(
  '/change-password',
  authMiddleware,
  asyncHandler(handleChangePassword),
);
authRoutes.get('/users', authMiddleware, isAdmin, handleGetAllUsers);
authRoutes.delete('/users/:email', authMiddleware, isAdmin, handleDeleteUser);
authRoutes.post('/promote', authMiddleware, isAdmin, handlePromoteUser);

export default authRoutes;
