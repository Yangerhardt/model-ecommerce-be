import redis from '../config/redis';
import { Cart } from '@ecommercebe/types/cart';

export const saveCart = async (cart: Cart): Promise<void> => {
  await redis.set(`cart:${cart.id}`, JSON.stringify(cart), 'EX', 60 * 60);
};

export const getCartById = async (cartId: string): Promise<Cart | null> => {
  const cartData = await redis.get(`cart:${cartId}`);
  if (!cartData) return null;
  return JSON.parse(cartData) as Cart;
};
 