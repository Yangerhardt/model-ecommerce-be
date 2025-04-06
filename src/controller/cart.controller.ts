import { Request, Response } from 'express';
import { CartItem } from '@ecommercebe/types/cart';
import { createCart } from '../service/cart.service';

export const handleCreateCart = async (req: Request, res: Response) => {
  const { items } = req.body as { items: CartItem[] };

  try {
    const cart = await createCart (items);
    return res.status(201).json({ message: 'Cart created with success', cart });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};
