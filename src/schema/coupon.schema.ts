import { z } from 'zod';

export const CouponSchema = z.object({
  code: z.string().min(2),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().min(1),
  createdAt: z.string(),
  expiresAt: z.string().optional(),
  isActive: z.boolean(),
  usageLimit: z.number().optional(),
});
