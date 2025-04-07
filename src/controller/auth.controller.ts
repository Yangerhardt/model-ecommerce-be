import { NextFunction, Request, Response } from 'express';
import {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
} from '../service/auth.service';

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

export const handleResetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  await resetPassword(token, password);
  res.json({ message: 'Password reset!' });
};
