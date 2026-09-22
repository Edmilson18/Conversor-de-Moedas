import axios from "axios";
import dotenv from "dotenv";
import {
  ExchangeRateResponse,
  ConversionResult,
  SupportedCodesResponse,
} from "./types.js";

dotenv.config();

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("A variável de ambiente API_KEY não foi encontrada.");
}

const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

export interface Currency {
  code: string;
  name: string;
}

export async function getCurrencies(): Promise<Currency[]> {
  try {
    const response = await axios.get<SupportedCodesResponse>(
      `${BASE_URL}/codes`
    );

    if (
      response.data.result !== "success" ||
      !Array.isArray(response.data.supported_codes)
    ) {
      throw new Error("Resposta inválida da API de moedas.");
    }

    return response.data.supported_codes.map(([code, name]) => ({
      code,
      name,
    }));
  } catch (error) {
    console.error("Erro ao carregar moedas:", error);
    throw new Error("Não foi possível carregar as moedas.");
  }
}

export async function convertCurrency(
  from: string,
  to: string,
  amount: number
): Promise<ConversionResult> {
  try {
    const response = await axios.get<ExchangeRateResponse>(
      `${BASE_URL}/latest/${from.toUpperCase()}`
    );

    if (response.data.result !== "success") {
      throw new Error("A API não retornou uma cotação válida.");
    }

    const rates = response.data.conversion_rates;
    const targetRate = rates[to.toUpperCase()];

    if (targetRate === undefined) {
      throw new Error("Moeda de destino não encontrada.");
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
    console.error("Erro ao realizar conversão:", error);
    throw new Error("Não foi possível realizar a conversão.");
  }
}
