import { Cart, CartItem } from '@ecommercebe/types/cart';
import { v4 as uuidv4 } from 'uuid';
import { saveCart } from '../model/cart.model';

export const createCart = async (items: CartItem[]): Promise<Cart> => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Cart cannot be empty');
  }

  let totalQuantity = 0;
  let totalPrice = 0;

  const processedItems = items.map((item, index) => {
    const { sku, name, price, quantity } = item;

    if (!sku || typeof sku !== 'string') {
      throw new Error(
        `Item ${index + 1}: sku is required and must be a string.`,
      );
    }

    if (!name || typeof name !== 'string') {
      throw new Error(
        `Item ${index + 1}: name is required and must be a string.`,
      );
    }

    if (typeof price !== 'number' || price < 0) {
      throw new Error(
        `Item ${index + 1}: price must be a non-negative number.`,
      );
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error(
        `Item ${index + 1}: quantity must be a positive integer.`,
      );
    }

    totalQuantity += quantity;
    totalPrice += quantity * price;

    return { sku, name, price, quantity };
  });

  const cart: Cart = {
    id: uuidv4(),
    items: processedItems,
    totalQuantity,
    totalPrice,
    createdAt: new Date().toISOString(),
  };

  await saveCart(cart);

  return cart;
};
