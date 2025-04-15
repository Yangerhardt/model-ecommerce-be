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

export interface Cart {
  id: string;
  items: CartItem[];
  userId: string;
  totalQuantity?: number;
  totalPrice?: number;
  coupon?: CartCoupon;
  discountAmount?: number;
  createdAt?: Date;
  expiresAt?: Date;
}
