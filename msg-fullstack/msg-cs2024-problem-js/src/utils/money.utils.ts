import { MoneyModel } from '../domain/money.model';
import { CurrencyType } from '../domain/currency-type.enum';

export function convert(money: MoneyModel, toCurrency: CurrencyType): MoneyModel {
  const conversionRate = getConversionRate(money.currency, toCurrency);
  return new MoneyModel({
    currency: toCurrency,
    amount: money.amount * conversionRate,
  });
}

export function getConversionRate(fromCurrency: CurrencyType, toCurrency: CurrencyType): number {
  if (fromCurrency === CurrencyType.RON && toCurrency === CurrencyType.EUR) {
    return 0.2;
  }
  if (fromCurrency === CurrencyType.EUR && toCurrency === CurrencyType.RON) {
    return 4.98;
  }
  if (fromCurrency === CurrencyType.RON && toCurrency === CurrencyType.USD) {
    return 0.1;
  }
  if (fromCurrency === CurrencyType.USD && toCurrency === CurrencyType.RON) {
    return 5;
  }
  if (fromCurrency === CurrencyType.EUR && toCurrency === CurrencyType.USD) {
    return 1;
  }
  if (fromCurrency === CurrencyType.USD && toCurrency === CurrencyType.EUR) {
    return 1;
  }
  return 1;
}
