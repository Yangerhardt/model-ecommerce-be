import { Request, Response, NextFunction } from 'express';
import {
  createOrderFromCart,
  getOrder,
  getOrdersByUser,
} from '../service/order.service';
import { AuthRequest } from '@ecommercebe/src/types/authRequest';
import { CreateOrderSchema } from '../schema/order.schema';

export const handleCreateOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parseResult = CreateOrderSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Invalid order payload',
        issues: parseResult.error.errors,
      });
    }

    const { cartId, paymentMethod } = parseResult.data;
    const userId = req.user?.id;

    const order = await createOrderFromCart(cartId, paymentMethod);

    if (order.userId !== userId) {
      return res
        .status(403)
        .json({ error: 'Access denied: this order does not belong to you' });
    }

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

export const handleGetOrder = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const orderId = req.params.id;

  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  const order = await getOrder(orderId);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (order.userId !== userId) {
    return res
      .status(403)
      .json({ error: 'Access denied: this order does not belong to you' });
  }

  res.status(200).json(order);
};

export const handleGetUserOrders = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const orders = await getOrdersByUser(userId);

  res.status(200).json(orders ?? []);
};
