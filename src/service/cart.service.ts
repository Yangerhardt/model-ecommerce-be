import { v4 as uuidv4 } from 'uuid';
import { saveCart } from '../model/cart.model';
import { Cart, CartItem } from '@ecommercebe/types/cart';

export const createCart = async (
  userId: string,
  items: CartItem[] = [],
): Promise<Cart> => {
  const cartId = uuidv4();
  const cart: Cart = {
    id: cartId,
    userId,
    items,
  };
  await saveCart(cart);
  return cart;
};
