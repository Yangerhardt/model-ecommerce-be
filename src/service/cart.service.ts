import { v4 as uuidv4 } from 'uuid';
import {
  getCartById,
  removeCart,
  saveCart,
  updateCart,
} from '../model/cart.model';
import {
  Cart,
  CartCoupon,
  CartItem,
  ShippingOptions,
} from '@ecommercebe/src/types/cart';
import { NotFoundError, ValidationError } from '../utils/errors';
import { getCouponByCode } from '../model/coupon.model';
import { getUserAddress } from '../model/address.model';
import { getShippingOptions, getValidatedCepInfo } from './shipping.service';

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
    price: {
      originalTotal: originalTotalPrice,
      finalTotal: originalTotalPrice,
    },
    totalQuantity,
  };
  await saveCart(cart);
  return cart;
};

export const getCart = async (cartId: string): Promise<Cart | null> => {
  return await getCartById(cartId);
};

export const deleteCart = async (cartId: string): Promise<void> => {
  const cart = await getCartById(cartId);
  if (!cart) throw new NotFoundError('Cart not found', 404);

  await removeCart(cartId);
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

  const originalTotal = cart.price?.originalTotal ?? 0;
  const shippingTotal = cart.price?.shippingTotal ?? 0;
  let discount = 0;

  if (coupon.discountType === 'percentage') {
    discount = ((originalTotal * coupon.discountValue) / 100) * -1;
  } else {
    discount = coupon.discountValue * -1;
  }

  const cartCoupon: CartCoupon = {
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    appliedAt: now.toISOString(),
  };

  return await updateCart(cartId, {
    coupon: cartCoupon,
    price: {
      ...cart.price,
      finalTotal: Math.max(originalTotal + shippingTotal + discount, 0),
      discountTotal: discount,
    },
  });
};

export const removeCouponFromCart = async (cartId: string) => {
  const cart = await getCart(cartId);
  if (!cart) throw new NotFoundError('Cart not found', 404);

  if (!cart.coupon) {
    throw new ValidationError('No coupon applied', 400);
  }

  const shippingtotal = cart.price?.shippingTotal ?? 0;
  return await updateCart(cartId, {
    coupon: undefined,
    discountAmount: 0,
    price: {
      ...cart.price,
      finalTotal: Math.max(cart.price.originalTotal + shippingtotal, 0),
    },
  });
};

export const applyAddressToCart = async (cartId: string, userId: string) => {
  const cart = await getCart(cartId);
  if (!cart) throw new NotFoundError('Cart not found', 404);

  const address = await getUserAddress(userId);
  if (!address) throw new NotFoundError('User address not found', 404);

  await getValidatedCepInfo(address.zip);

  return await updateCart(cartId, {
    shippingAddress: address,
  });
};

export const calculateAndApplyShippingCost = async (
  cartId: string,
  userId: string,
) => {
  const cart = await getCart(cartId);
  if (!cart) throw new NotFoundError('Cart not found', 404);

  const address = await getUserAddress(userId);
  if (!address) throw new NotFoundError('User address not found', 404);

  const shippingOptions: ShippingOptions[] = await getShippingOptions(
    address.zip,
    cart.items,
  );
  const shippingCost = shippingOptions.filter((option) => !option.error)?.[0];

  return await updateCart(cartId, {
    shippingCost: {
      id: shippingCost.id,
      name: shippingCost.name,
      price: shippingCost.price,
      custom_price: shippingCost.custom_price,
      discount: shippingCost.discount,
      currency: shippingCost.currency,
      delivery_time: shippingCost.delivery_time,
    },
    price: {
      ...cart.price,
      shippingTotal: parseFloat(shippingCost.price),
      finalTotal: Math.max(
        cart.price.finalTotal + parseFloat(shippingCost.price),
        0,
      ),
    },
  });
};
