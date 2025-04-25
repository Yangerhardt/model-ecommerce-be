import { z } from 'zod';

const CardSchema = z.object({
  brand: z.string(),
  last4: z.string().length(4),
  expirationDate: z.string().min(1).max(12),
});

export const PaymentSchema = z.object({
  method: z.enum(['boleto', 'card']),
  status: z.enum(['pending', 'paid', 'refunded', 'cancelled']),
  transactionId: z.string().optional(),
  amount: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  card: CardSchema.optional(),
});

export type Payment = z.infer<typeof PaymentSchema>;

export const CreateOrderSchema = z.object({
  cartId: z.string().uuid(),
  payment: PaymentSchema,
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

export const OrderStatusSchema = z.enum([
  'pending',
  'processing',
  'paid',
  'shipped',
  'delivered',
  'cancelled',
]);

export const UpdateOrderStatusSchema = z.object({
  orderId: z.string().uuid(),
  status: OrderStatusSchema,
});

export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;

export const GetOrdersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type GetOrdersQueryInput = z.infer<typeof GetOrdersQuerySchema>;
