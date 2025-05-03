import { calculateShipping, validateCep } from '../model/shipping.model';
import { CartItem } from '../types/cart';

export const getValidatedCepInfo = async (cep: string) => {
  return await validateCep(cep);
};

export const getShippingOptions = async (
  cep: string,
  cartItems: CartItem[],
) => {
  return await calculateShipping(cep, cartItems);
};
