import { calculateShipping, validateCep } from '../model/shipping.model';

export const getValidatedCepInfo = async (cep: string) => {
  return await validateCep(cep);
};

export const getShippingOptions = async (cep: string) => {
  return await calculateShipping(cep);
};
