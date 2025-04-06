import { Request, Response } from 'express';
import {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
} from '../service/auth.service';

export const handleRegister = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await registerUser(email, password);
  res.json({ message: 'Usuário cadastrado com sucesso!', id: result.id });
};

export const handleLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { token, id } = await loginUser(email, password);
  res.json({ message: 'Sucesso', token, email, id });
};

export const handleForgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  await requestPasswordReset(email);
  res.json({ message: 'Email de recuperação enviado!' });
};

export const handleResetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  await resetPassword(token, password);
  res.json({ message: 'Senha redefinida com sucesso!' });
};
