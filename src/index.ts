import inquirer from 'inquirer';
import { convertCurrency } from './converter.js';

async function run() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'from',
      message: 'Moeda de origem (ex: USD, EUR, BRL):',
      default: 'USD',
    },
    {
      type: 'input',
      name: 'to',
      message: 'Moeda de destino (ex: BRL, EUR, JPY):',
      default: 'BRL',
    },
    {
      type: 'number',
      name: 'amount',
      message: 'Valor a converter:',
      default: 1,
    },
  ]);

  try {
    const result = await convertCurrency(answers.from, answers.to, answers.amount);
    console.log(`\n--- Resultado da Conversão ---`);
    console.log(`${result.amount} ${result.from} = ${result.convertedAmount} ${result.to}`);
    console.log(`Taxa aplicada: 1 ${result.from} = ${result.rate} ${result.to}\n`);
  } catch (error) {
    console.error((error as Error).message);
  }
}

run();