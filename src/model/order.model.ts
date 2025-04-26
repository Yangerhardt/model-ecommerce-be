import redis from '../config/redis';
import { Order } from '@ecommercebe/src/types/order';

export const saveOrder = async (order: Order): Promise<void> => {
  await redis.set(`order:${order.id}`, JSON.stringify(order));

  const existing = await getOrdersByUserId(order.userId);
  const updatedOrders = existing ? [...existing, order] : [order];
  await redis.set(`user:orders:${order.userId}`, JSON.stringify(updatedOrders));
};

export const getOrdersByUserId = async (
  userId: string,
): Promise<Order[] | null> => {
  const data = await redis.get(`user:orders:${userId}`);
  if (!data) return null;
  return JSON.parse(data) as Order[];
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  const data = await redis.get(`order:${orderId}`);
  if (!data) return null;
  return JSON.parse(data) as Order;
};

export const updateOrder = async (
  orderId: string,
  updates: Partial<Order>,
): Promise<Order | null> => {
  const existing = await getOrderById(orderId);
  if (!existing) return null;

  const updated: Order = {
    ...existing,
    ...updates,
    updatedAt: new Date(),
  };

  await saveOrder(updated);
  return updated;
};

export const removeOrder = async (orderId: string): Promise<void> => {
  await redis.del(`order:${orderId}`);
  await redis.del(`user:orders:${orderId}`);
};
