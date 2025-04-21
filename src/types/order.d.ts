import { CartCoupon, CartItem, ShippingOptions } from './cart';
import { UserAddress } from './address';

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  coupon?: CartCoupon;
  shippingAddress: UserAddress;
  shippingCost: ShippingOptions;
  totalPrice: number;
  originalTotalPrice: number;
  discountAmount?: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  paymentMethod: 'boleto' | 'card';
}
