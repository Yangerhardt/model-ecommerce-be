import { Response } from 'express';
import { createCart } from '../service/cart.service';
import { AuthRequest } from '@ecommercebe/types/authRequest';
import { CreateCartSchema } from '../schema/cart.schema';

export const handleCreateCart = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const parsed = CreateCartSchema.safeParse(req.body);

  if (!parsed.success) {
    const errors = parsed.error.flatten();
    return res
      .status(400)
      .json({ error: 'Invalid data', details: errors.fieldErrors });
  }
  const { items } = req.body;

  const cart = await createCart(userId, items);
  res.status(201).json(cart);
};
