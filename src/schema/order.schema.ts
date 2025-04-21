import { z } from 'zod';

export const PaymentMethodSchema = z.enum(['boleto', 'card']);

export const CreateOrderSchema = z.object({
  cartId: z.string().uuid(),
  paymentMethod: PaymentMethodSchema,
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
