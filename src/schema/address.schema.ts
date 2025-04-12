import { z } from 'zod';

export const UserAddressSchema = z.object({
  zip: z.string().min(5),
  address1: z.string().min(3),
  address2: z.string().optional(),
  city: z.string(),
  province: z.string(),
  phoneNumber: z.string(),
  neighborhood: z.string().optional(),
});

export type UserAddressInput = z.infer<typeof UserAddressSchema>;
