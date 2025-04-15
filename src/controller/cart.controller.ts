import { NextFunction, Response, Request } from 'express';
import {
  applyCouponToCart,
  createCart,
  getCart,
} from '../service/cart.service';
import { CreateCartSchema } from '../schema/cart.schema';
import { AuthRequest } from '@ecommercebe/src/types/authRequest';

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

export const handleGetCart = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const cartId = req.params.id;

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  if (!cartId) {
    return res.status(400).json({ error: 'Cart ID is required' });
  }

  const cart = await getCart(cartId);

  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  if (cart.userId !== userId) {
    return res
      .status(403)
      .json({ error: 'Access denied: this cart does not belong to you' });
  }

  const now = Date.now();
  if (!cart.expiresAt) {
    return res
      .status(500)
      .json({ error: 'Invalid cart data: missing expiration date' });
  }

  const cartExpiration = new Date(cart.expiresAt).getTime();

  if (now > cartExpiration) {
    return res.status(410).json({ error: 'Cart expired' });
  }

  res.status(200).json(cart);
};

export const handleApplyCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cartId, couponCode } = req.body;

    if (!cartId || !couponCode) {
      return res
        .status(400)
        .json({ error: 'cartId and couponCode are required' });
    }

    const updatedCart = await applyCouponToCart(cartId, couponCode);
    res.status(200).json(updatedCart);
  } catch (error) {
    next(error);
  }
};
