import { CartItem } from '../types/cart';
import { ValidationError } from '../utils/errors';

export const validateCep = async (cep: string) => {
  const cleanCep = cep.replace(/\D/g, '');

  if (!/^\d{8}$/.test(cleanCep)) {
    throw new ValidationError('Invalid ZIP code', 400);
  }

  const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
  const data = await response.json();

  if (data.erro || !data.uf) {
    throw new ValidationError('Address not found', 404);
  }

  return data;
};

export const calculateShipping = async (cep: string, cartItems: CartItem[]) => {
  const cleanCep = cep.replace(/\D/g, '');

  if (!/^\d{8}$/.test(cleanCep)) {
    throw new ValidationError('Invalid ZIP code', 400);
  }

  const API_URL = 'https://www.melhorenvio.com.br/api/v2/me/shipment/calculate';
  const API_KEY = process.env.MELHOR_ENVIO_API_KEY;

  const products = cartItems.map((item) => ({
    id: item.id,
    width: item.width,
    height: item.height,
    length: item.length,
    weight: item.weight / 1000,
    insurance_value: item.price,
    quantity: item.quantity,
  }));

  const body = {
    from: {
      postal_code: process.env.POSTAL_CODE_SENDER,
    },
    to: {
      postal_code: cleanCep,
    },
    products,
    options: {
      receipt: false,
      own_hand: false,
      collect: false,
      reverse: false,
      non_commercial: false,
    },
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ValidationError('Failed to fetch shipping data', response.status);
  }

  return data.slice(0, 4);
};
