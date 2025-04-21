import { Order } from '@ecommercebe/src/types/order';
import { getCartById, removeCart } from '../model/cart.model';
import {
  saveOrder,
  getOrderById,
  getOrdersByUserId,
} from '../model/order.model';
import { NotFoundError, ValidationError } from '../utils/errors';
import { v4 as uuidv4 } from 'uuid';

export const createOrderFromCart = async (
  cartId: string,
  paymentMethod: Order['paymentMethod'],
): Promise<Order> => {
  const cart = await getCartById(cartId);
  if (!cart) throw new NotFoundError('Cart not found', 404);

  if (!cart.shippingAddress || !cart.shippingCost) {
    throw new ValidationError('Shipping information incomplete', 400);
  }

  const now = new Date();
  const orderId = uuidv4();

  const order: Order = {
    id: orderId,
    userId: cart.userId,
    items: cart.items,
    coupon: cart.coupon,
    shippingAddress: cart.shippingAddress,
    shippingCost: cart.shippingCost,
    totalPrice: cart.totalPrice,
    originalTotalPrice: cart.originalTotalPrice,
    discountAmount: cart.discountAmount,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
    paymentMethod,
  };

  await saveOrder(order);
  await removeCart(cartId);

  return order;
};

export const getOrder = async (orderId: string): Promise<Order | null> => {
  return await getOrderById(orderId);
};

export const getOrdersByUser = async (
  userId: string,
): Promise<Order[] | null> => {
  return await getOrdersByUserId(userId);
};
