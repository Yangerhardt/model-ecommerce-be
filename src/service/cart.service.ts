import { v4 as uuidv4 } from 'uuid';
import { getCartById, saveCart } from '../model/cart.model';
import { Cart, CartItem } from '@ecommercebe/types/cart';

const handleCartTotal = (
  items: CartItem[],
): {
  totalQuantity: number;
  totalPrice: number;
} => {
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  return { totalQuantity, totalPrice };
};

export const createCart = async (
  userId: string,
  items: CartItem[] = [],
): Promise<Cart> => {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1h
  const { totalQuantity, totalPrice } = handleCartTotal(items);

  const cartId = uuidv4();
  const cart: Cart = {
    id: cartId,
    userId,
    items,
    createdAt: now,
    expiresAt,
    totalPrice,
    totalQuantity,
  };
  await saveCart(cart);
  return cart;
};

export const getCart = async (cartId: string): Promise<Cart | null> => {
  return await getCartById(cartId);
};
