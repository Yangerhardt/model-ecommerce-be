import { UserAddress } from './address';

export interface CartCoupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  appliedAt?: string;
}

export interface CartItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  productTitle: string;
  productImage: string;
}

export interface ShippingOptions {
  id: string;
  name: string;
  price: string;
  custom_price: string;
  discount: string;
  currency: string;
  delivery_time: number;
  error?: string;
}

export interface CartPrice {
  originalTotal: number;
  shippingTotal?: number;
  discountTotal?: number;
  finalTotal: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalQuantity: number;
  price: CartPrice;
  coupon?: CartCoupon;
  discountAmount?: number;
  shippingAddress?: UserAddress;
  shippingCost?: ShippingOptions;
  createdAt?: Date;
  expiresAt?: Date;
}
