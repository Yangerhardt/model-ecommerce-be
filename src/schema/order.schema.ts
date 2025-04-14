import { z } from 'zod';

const baseOrderSchema = z.object({
  userId: z
    .string({
      required_error: 'User id is required',
      invalid_type_error: 'User id must be a string',
    })
    .min(1, { message: 'User id can not be empty' }),

  totalAmount: z
    .number({
      required_error: 'Total amount is required',
      invalid_type_error: 'Total amount must be a number',
    })
    .positive(),
});

export const createOrderSchema = baseOrderSchema.strict();

export const updateOrderSchema = baseOrderSchema.partial();
