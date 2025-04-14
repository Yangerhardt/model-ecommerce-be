import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import {
  getUserByEmail,
  saveUser,
  saveResetToken,
  getEmailByResetToken,
  getAllUsersFromRedis,
  deleteUserFromRedis,
} from '../model/auth.model';
import { sendResetEmail } from '../utils/mailer';
import { AlreadyExists, NotFoundError, ValidationError } from '../utils/errors';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const registerUser = async (
  email: string,
  password: string,
  role: 'user' | 'admin' = 'user',
) => {
  const existing = await getUserByEmail(email);
  if (existing) throw new AlreadyExists('User already registered', 400);

  const userId = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);

  await saveUser(email, {
    id: userId,
    email,
    password: hashedPassword,
    role: role,
  });

  return { id: userId };
};

export const loginUser = async (email: string, password: string) => {
  const user = await getUserByEmail(email);
  if (!user) throw new NotFoundError('User not found', 404);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ValidationError('Invalid password', 400);

  const token = jwt.sign(
    { email, id: user.id, role: user.role ?? 'user' },
    JWT_SECRET,
    {
      expiresIn: '1d',
    },
  );

  return { token, id: user.id };
};

export const requestPasswordReset = async (email: string) => {
  const user = await getUserByEmail(email);
  if (!user) throw new NotFoundError('User not found', 404);

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '15m' });
  await saveResetToken(token, email);
  await sendResetEmail(email, token);
};

export const resetPassword = async (token: string, newPassword: string) => {
  const email = await getEmailByResetToken(token);
  if (!email) throw new ValidationError('Invalid token', 401);

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await saveUser(email, { email, password: hashedPassword });

  return;
};

export const fetchAllUsers = async () => {
  return await getAllUsersFromRedis();
};

export const removeUserByEmail = async (email: string) => {
  const users = await getAllUsersFromRedis();
  const user = users.find((u) => u.email === email);

  if (!user) {
    throw new NotFoundError('User not found', 404);
  }

  await deleteUserFromRedis(email);
  return { message: `User ${email} removed.` };
};

export const promoteUserByEmail = async (email: string) => {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new NotFoundError('User not found', 404);
  }

  user.role = 'admin';
  await saveUser(email, user);

  return { message: `User ${email} promoted to admin.` };
};
