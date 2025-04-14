import { v4 as uuidv4 } from 'uuid';
import { getCartById, saveCart } from '../model/cart.model';
import { Cart, CartItem } from '@ecommercebe/types/cart';

export const createCart = async (
  userId: string,
  items: CartItem[] = [],
): Promise<Cart> => {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1h
  
  const cartId = uuidv4();
  const cart: Cart = {
    id: cartId,
    userId,
    items,
    createdAt: now,
    expiresAt,
  };
  await saveCart(cart);
  return cart;
};

export const getCart = async (cartId: string): Promise<Cart | null> => {
  return await getCartById(cartId);
};
