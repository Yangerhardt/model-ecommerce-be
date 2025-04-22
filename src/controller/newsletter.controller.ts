import { Request, Response } from 'express';
import { registerNewsletterEmail } from '../service/newsletter.service';

export const handleRegisterForNewsletter = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  const result = await registerNewsletterEmail(email, name);
  res.json({ message: 'Email registered for newsletter!', id: result.id });
};
