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

export const calculateShipping = async (cep: string) => {
  const cleanCep = cep.replace(/\D/g, '');

  if (!/^\d{8}$/.test(cleanCep)) {
    throw new ValidationError('Invalid ZIP code', 400);
  }

  const API_URL = 'https://www.melhorenvio.com.br/api/v2/me/shipment/calculate';
  const API_KEY = process.env.MELHOR_ENVIO_API_KEY;

  const body = {
    from: {
      postal_code: process.env.POSTAL_CODE_SENDER,
    },
    to: {
      postal_code: cleanCep,
    },
    products: [
      {
        id: '1',
        width: 15,
        height: 10,
        length: 20,
        weight: 1,
        insurance_value: 100,
        quantity: 1,
      },
    ],
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
