import { z } from 'zod';

export const CartItemSchema = z.object({
  id: z.string().min(1, 'id deve ser ao menos 1'),
  sku: z.string().min(1, 'sku deve ser ao menos 1'),
  quantity: z.number().int().min(1, 'Quantidade deve ser ao menos 1'),
  price: z.number().nonnegative('Preço deve ser um número positivo'),
});

export const CreateCartSchema = z.object({
  items: z.array(CartItemSchema).min(1, 'Carrinho não pode estar vazio'),
});
