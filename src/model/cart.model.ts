import redis from '../config/redis';
import { Cart } from '@ecommercebe/src/types/cart';

export const saveCart = async (cart: Cart): Promise<void> => {
  await redis.set(`cart:${cart.id}`, JSON.stringify(cart), 'EX', 60 * 60);
};

export const getCartById = async (cartId: string): Promise<Cart | null> => {
  const cartData = await redis.get(`cart:${cartId}`);
  if (!cartData) return null;
  return JSON.parse(cartData) as Cart;
};

export const updateCart = async (cartId: string, updates: Partial<Cart>) => {
  const existingCart = await getCartById(cartId);
  if (!existingCart) return null;

  const updatedCart: Cart = {
    ...existingCart,
    ...updates,
  };

  await saveCart(updatedCart);
  return updatedCart;
};

export const removeCart = async (cartId: string) => {
  await redis.del(`cart:${cartId}`);
};
