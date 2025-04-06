import redis from '../config/redis';
import { Cart } from '@ecommercebe/types/cart';

export const saveCart = async (cart: Cart): Promise<void> => {
  await redis.set(`cart:${cart.id}`, JSON.stringify(cart));
};
