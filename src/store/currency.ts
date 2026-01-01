import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Currency = "EUR" | "PLN" | "USD";

interface CurrencyState {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceInPln: number) => string;
  convertPrice: (priceInPln: number) => number;
}

// Approximate exchange rates (PLN base)
const exchangeRates: Record<Currency, number> = {
  PLN: 1,
  EUR: 0.23,  // 1 PLN = 0.23 EUR
  USD: 0.25,  // 1 PLN = 0.25 USD
};

const currencySymbols: Record<Currency, string> = {
  EUR: "€",
  PLN: "zł",
  USD: "$",
};

export const useCurrency = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: "PLN",

      setCurrency: (currency: Currency) => set({ currency }),

      convertPrice: (priceInPln: number) => {
        const { currency } = get();
        return priceInPln * exchangeRates[currency];
      },

      formatPrice: (priceInPln: number) => {
        const { currency, convertPrice } = get();
        const converted = convertPrice(priceInPln);
        const symbol = currencySymbols[currency];

        // Format based on currency
        if (currency === "PLN") {
          return `${converted.toFixed(2)} ${symbol}`;
        }
        return `${symbol}${converted.toFixed(2)}`;
      },
    }),
    {
      name: "currency-storage",
    }
  )
);
