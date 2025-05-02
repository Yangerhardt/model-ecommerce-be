export async function validateBrazilianAddress(address: {
  zip: string;
  city: string;
  province: string;
}) {
  const cleanCep = address.zip.replace(/\D/g, '');

  if (!/^\d{8}$/.test(cleanCep)) {
    return {
      success: false,
      status: 400,
      error: 'Invalid ZIP code format',
    };
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();

    if (data.erro) {
      return {
        success: false,
        status: 400,
        error: 'Invalid ZIP code',
      };
    }

    const isCityMatch =
      data.localidade.toLowerCase() === address.city.toLowerCase();
    const isProvinceMatch =
      data.uf.toLowerCase() === address.province.toLowerCase();

    if (!isCityMatch || !isProvinceMatch) {
      return {
        success: false,
        status: 422,
        error: 'City or state do not match ZIP code',
        details: {
          actual: { city: data.localidade, state: data.uf },
          provided: { city: address.city, state: address.province },
        },
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      status: 500,
      error: 'Failed to validate ZIP code',
      details: error,
    };
  }
}
