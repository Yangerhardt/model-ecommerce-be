import {
  getNewsletterUserByEmail,
  saveNewsletterEmail,
} from '../model/newsletter.model';
import { v4 as uuidv4 } from 'uuid';
import { AlreadyExists } from '../utils/errors';

export const registerNewsletterEmail = async (name: string, email: string) => {
  const existing = await getNewsletterUserByEmail(email);
  if (existing) throw new AlreadyExists('User already registered', 400);

  const userId = uuidv4();

  await saveNewsletterEmail(email, {
    id: userId,
    email,
    name,
  });

  return { id: userId };
};
