const BASE_URL = 'https://api.apilayer.com/exchangerates_data';
const API_KEY = 'REPLACE_WITH_YOUR_API_KEY'

type API = (params: {
  endpoint: string,
  params?: {
    base?: string,
    from?: string,
    to?: string,
    amount?: string
  },
}) => Promise<Response>;

const api: API = ({ endpoint, params = {} }) => {
  const searchParams = new URLSearchParams(params);
  const queryString = searchParams.toString();

  return fetch(`${BASE_URL}${endpoint}?${queryString}`, {headers: { apikey: API_KEY }});
};

export const fetchRates = async (baseCurrency: string) => {
  try {
    const response = await api({ endpoint: '/latest', params: { base: baseCurrency } });
    const responseText = await response.text();
    const { rates, error } = JSON.parse(responseText);

    if (error) {
      throw new Error(error);
    }

    if (!rates || !Object.keys(rates).length) {
      throw new Error('Could not fetch rates.');
    }

    return rates;
  } catch (errorResponse) {
    throw errorResponse;
  }
};

export const convertCurrency = async (fromCurrency: string, toCurrency: string, amount: number) => {
  try {
    const response = await api({ endpoint: '/convert', params: { from: fromCurrency, to: toCurrency, amount: amount.toString() } });
    const responseText = await response.text();
    const { result, error } = JSON.parse(responseText);

    if (error) {
      throw new Error(error);
    }

    if (!result) {
      throw new Error('Could not fetch convert endpoint.');
    }

    return result;
  } catch (errorResponse) {
    throw errorResponse;
  }
}

export const getSymbols = async () => {
  try {
    const response = await api({ endpoint: '/symbols'});
    const responseText = await response.text();
    const { symbols, error } = JSON.parse(responseText);

    if (error) {
      throw new Error(error);
    }

    if (!symbols) {
      throw new Error('Could not fetch symbols endpoint.');
    }

    return symbols;
  } catch (errorResponse) {
    throw errorResponse;
  }
}
