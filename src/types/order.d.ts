import { Cart } from './cart';
import { UserAddress } from './address';

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type Brand =
  | 'visa'
  | 'mastercard'
  | 'amex'
  | 'diners'
  | 'elo'
  | 'discover';

type Card = {
  brand: Brand;
  last4: string;
  expirationDate: string;
  name?: string;
};

export type Payment = {
  method: 'boleto' | 'card';
  status: 'pending' | 'paid' | 'refunded' | 'cancelled';
  transactionId?: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  card?: Card;
};

export interface Order extends Cart {
  id: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  payment: Payment;
}
