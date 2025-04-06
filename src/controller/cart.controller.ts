import { Response } from 'express';
import { createCart } from '../service/cart.service';
import { AuthRequest } from '@ecommercebe/types/authRequest';

export const handleCreateCart = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { items } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  const cart = await createCart(userId, items);
  res.status(201).json(cart);
};
