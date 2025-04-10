import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import {
  getUserByEmail,
  saveUser,
  saveResetToken,
  getEmailByResetToken,
} from '../model/auth.model';
import { sendResetEmail } from '../utils/mailer';
import { AppError } from '../error/appError';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const registerUser = async (email: string, password: string) => {
  const existing = await getUserByEmail(email);
  if (existing) throw new AppError('User already registered', 400);

  const userId = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);

  await saveUser(email, { id: userId, email, password: hashedPassword });

  return { id: userId };
};

export const loginUser = async (email: string, password: string) => {
  const user = await getUserByEmail(email);
  if (!user) throw new AppError('User not found', 404);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError('Invalid password', 400);

  const token = jwt.sign({ email, id: user.id }, JWT_SECRET, {
    expiresIn: '24h',
  });

  return { token, id: user.id };
};

export const requestPasswordReset = async (email: string) => {
  const user = await getUserByEmail(email);
  if (!user) throw new AppError('User not found', 404);

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '15m' });
  await saveResetToken(token, email);
  await sendResetEmail(email, token);
};

export const resetPassword = async (token: string, newPassword: string) => {
  const email = await getEmailByResetToken(token);
  if (!email) throw new AppError('Invalid token', 401);

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await saveUser(email, { email, password: hashedPassword });

  return;
};
