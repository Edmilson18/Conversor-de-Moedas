import axios from 'axios';
import dotenv from 'dotenv';
import { ExchangeRateResponse, ConversionResult } from './types';

// Carrega as variáveis do arquivo .env para o process.env
dotenv.config();

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error('A variável de ambiente API_KEY não foi encontrada no arquivo .env!');
}

const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest`;

export async function convertCurrency(
  from: string,
  to: string,
  amount: number
): Promise<ConversionResult> {
  try {
    const response = await axios.get<ExchangeRateResponse>(`${BASE_URL}/${from.toUpperCase()}`);
    const rates = response.data.conversion_rates;

    const targetRate = rates[to.toUpperCase()];
    if (!targetRate) {
      throw new Error(`Moeda de destino '${to}' não encontrada.`);
    }

    const convertedAmount = amount * targetRate;

    return {
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      amount,
      convertedAmount: Number(convertedAmount.toFixed(2)),
      rate: targetRate,
    };
  } catch (error) {
    throw new Error(`Erro ao buscar taxas de câmbio: ${(error as Error).message}`);
  }
}