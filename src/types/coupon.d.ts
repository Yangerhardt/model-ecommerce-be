export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
  usageLimit?: number;
}
