import { v4 as uuidv4 } from 'uuid';
import { getCartById, saveCart, updateCart } from '../model/cart.model';
import { Cart, CartCoupon, CartItem } from '@ecommercebe/src/types/cart';
import { NotFoundError, ValidationError } from '../utils/errors';
import { getCouponByCode } from '../model/coupon.model';

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

  const originalTotalPrice = totalPrice;
  const cartId = uuidv4();
  const cart: Cart = {
    id: cartId,
    userId,
    items,
    createdAt: now,
    expiresAt,
    totalPrice,
    totalQuantity,
    originalTotalPrice,
  };
  await saveCart(cart);
  return cart;
};

export const getCart = async (cartId: string): Promise<Cart | null> => {
  return await getCartById(cartId);
};

export const applyCouponToCart = async (cartId: string, couponCode: string) => {
  const cart = await getCart(cartId);
  if (!cart) throw new NotFoundError('Cart not found', 404);

  const coupon = await getCouponByCode(couponCode);
  if (!coupon || !coupon.isActive) {
    throw new ValidationError('Invalid or inactive coupon', 400);
  }

  const now = new Date();
  if (coupon.expiresAt && new Date(coupon.expiresAt) < now) {
    throw new ValidationError('Coupon expired', 400);
  }

  if (cart.coupon && cart.coupon.code === couponCode) {
    throw new ValidationError('Coupon already applied', 400);
  }

  const originalTotal = cart.totalPrice ?? 0;
  let discount = 0;

  if (coupon.discountType === 'percentage') {
    discount = (originalTotal * coupon.discountValue) / 100;
  } else {
    discount = coupon.discountValue;
  }

  const finalTotal = Math.max(originalTotal - discount, 0);

  const cartCoupon: CartCoupon = {
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    appliedAt: now.toISOString(),
  };

  return await updateCart(cartId, {
    coupon: cartCoupon,
    discountAmount: discount,
    totalPrice: finalTotal,
  });
};

export const removeCouponFromCart = async (cartId: string) => {
  const cart = await getCart(cartId);
  if (!cart) throw new NotFoundError('Cart not found', 404);

  if (!cart.coupon) {
    throw new ValidationError('No coupon applied', 400);
  }

  return await updateCart(cartId, {
    coupon: undefined,
    discountAmount: 0,
    totalPrice: cart.totalPrice! + cart.discountAmount!,
  });
};
