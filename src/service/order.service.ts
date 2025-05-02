import { Order, OrderStatus, Payment } from '@ecommercebe/src/types/order';
import { getCartById, removeCart } from '../model/cart.model';
import {
  saveOrder,
  getOrderById,
  getOrdersByUserId,
  updateOrder,
  removeOrder,
  getAllOrdersFromRedis,
} from '../model/order.model';
import { NotFoundError, ValidationError } from '../utils/errors';
import { v4 as uuidv4 } from 'uuid';

export const createOrderFromCart = async (
  cartId: string,
  payment: Payment,
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
    totalQuantity: cart.totalQuantity,
    discountAmount: cart.discountAmount,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
    payment,
    price: {
      originalTotal: cart.price.originalTotal,
      finalTotal: cart.price.finalTotal,
      discountTotal: cart.price?.discountTotal,
      shippingTotal: cart.price?.shippingTotal,
    },
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

export const cancelOrder = async (orderId: string): Promise<Order | null> => {
  const order = await getOrderById(orderId);
  if (!order) throw new NotFoundError('Order not found', 404);

  const updatedOrder = {
    ...order,
    status: 'canceled' as OrderStatus,
    updatedAt: new Date(),
  };

  await updateOrder(orderId, updatedOrder);
  return updatedOrder;
};

export const deleteOrder = async (orderId: string): Promise<void> => {
  const order = await getOrderById(orderId);
  if (!order) throw new NotFoundError('Order not found', 404);

  await removeOrder(orderId);
};

export const fetchAllOrders = async () => {
  return await getAllOrdersFromRedis();
};
