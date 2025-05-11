import { NextFunction, Request, Response } from 'express';
import {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPasswordWithToken,
  promoteUserByEmail,
  fetchAllUsers,
  removeUserByEmail,
  changePassword,
} from '../service/auth.service';
import { AuthRequest } from '../types/authRequest';
import { NotAllowedError, NotFoundError } from '../utils/errors';

export const handleRegister = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await registerUser(email, password);
  res.json({ message: 'User registered!', id: result.id });
};

export const handleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const handleForgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  await requestPasswordReset(email);
  res.json({ message: 'Recovery email sent!' });
};

export const handleResetPasswordWithToken = async (
  req: Request,
  res: Response,
) => {
  const { token } = req.params;
  const { password } = req.body;

  await resetPasswordWithToken(token, password);
  res.json({ message: 'Password reset!' });
};

export const handleChangePassword = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const email = req.user?.email;

  if (!userId) {
    return res.status(403).json({ error: new NotAllowedError('Unauthorized') });
  }
  if (!email) {
    return res
      .status(404)
      .json({ error: new NotFoundError('Email not found') });
  }

  const { currentPassword, newPassword } = req.body;

  if (newPassword === currentPassword) {
    return res.status(401).json({ error: 'Can not use same password' });
  }

  await changePassword(currentPassword, newPassword, email);
  res.status(200).json({ message: 'Password reset!' });
};

export const handleGetAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await fetchAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const handleDeleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.params;
    const result = await removeUserByEmail(email);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const handlePromoteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    const result = await promoteUserByEmail(email);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
