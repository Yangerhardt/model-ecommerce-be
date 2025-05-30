import { Request, Response, NextFunction } from 'express';
import {
  cancelOrder,
  createOrderFromCart,
  deleteOrder,
  fetchAllOrders,
  getOrder,
  getOrdersByUser,
} from '../service/order.service';
import { AuthRequest } from '@ecommercebe/src/types/authRequest';
import { CreateOrderSchema } from '../schema/order.schema';
import { Brand } from '../types/order';
import {
  NotAllowedError,
  NotFoundError,
  ValidationError,
} from '../utils/errors';

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

    const { cartId, payment } = parseResult.data;
    const userId = req.user?.id;

    const mappedPayment = {
      ...payment,
      card: payment.card
        ? {
            ...payment.card,
            expirationDate: payment.card.expirationDate,
            brand: payment.card.brand as Brand,
          }
        : undefined,
    };

    const order = await createOrderFromCart(cartId, mappedPayment);

    if (order.userId !== userId) {
      return res.status(403).json({
        error: new NotAllowedError('Unauthorized'),
      });
    }

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

export const handleGetOrder = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { orderId } = req.params;

  if (!orderId) {
    return res
      .status(400)
      .json({ error: new ValidationError('Order ID is required') });
  }

  const order = await getOrder(orderId);

  if (!order) {
    return res
      .status(404)
      .json({ error: new NotFoundError('Order not found') });
  }

  if (order.userId !== userId) {
    return res.status(403).json({
      error: new NotAllowedError('Unauthorized'),
    });
  }

  res.status(200).json(order);
};

export const handleGetUserOrders = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(403).json({
      error: new NotAllowedError('Unauthorized'),
    });
  }

  const orders = await getOrdersByUser(userId);

  res.status(200).json(orders ?? []);
};

export const handleCancelOrder = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { orderId } = req.params;

  if (!orderId) {
    return res
      .status(400)
      .json({ error: new ValidationError('Order ID is required') });
  }

  const order = await getOrder(orderId);

  if (!order) {
    return res
      .status(404)
      .json({ error: new NotFoundError('Order not found') });
  }

  if (order.userId !== userId) {
    return res.status(403).json({
      error: new NotAllowedError('Unauthorized'),
    });
  }

  const canceledOrder = await cancelOrder(orderId);

  res.status(200).json(canceledOrder);
};

export const handleDeleteOrder = async (req: AuthRequest, res: Response) => {
  const { orderId } = req.params;

  if (!orderId) {
    return res
      .status(400)
      .json({ error: new ValidationError('Order ID is required') });
  }

  const order = await getOrder(orderId);

  if (!order) {
    return res
      .status(404)
      .json({ error: new NotFoundError('Order not found') });
  }

  await deleteOrder(orderId);

  res.status(200).json({ message: 'Order deleted successfully' });
};

export const handleGetAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await fetchAllOrders();
    res.json(users);
  } catch (err) {
    next(err);
  }
};
