import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Currency = "EUR" | "PLN" | "USD";

interface ExchangeRates {
  PLN: number;
  EUR: number;
  USD: number;
}

interface CurrencyState {
  currency: Currency;
  exchangeRates: ExchangeRates;
  lastUpdated: string | null;
  isLoading: boolean;
  error: string | null;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceInPln: number) => string;
  convertPrice: (priceInPln: number) => number;
  fetchExchangeRates: () => Promise<void>;
}

// Fallback exchange rates (PLN base)
const fallbackRates: ExchangeRates = {
  PLN: 1,
  EUR: 0.23,
  USD: 0.25,
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
      exchangeRates: fallbackRates,
      lastUpdated: null,
      isLoading: false,
      error: null,

      setCurrency: (currency: Currency) => set({ currency }),

      convertPrice: (priceInPln: number) => {
        const { currency, exchangeRates } = get();
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

      fetchExchangeRates: async () => {
        const { lastUpdated } = get();

        // Don't fetch if we updated less than 30 minutes ago
        if (lastUpdated) {
          const lastUpdate = new Date(lastUpdated);
          const now = new Date();
          const diffMinutes = (now.getTime() - lastUpdate.getTime()) / (1000 * 60);
          if (diffMinutes < 30) {
            return; // Skip fetch, rates are fresh enough
          }
        }

        set({ isLoading: true, error: null });

        try {
          const response = await fetch("/api/exchange-rates");
          const data = await response.json();

          if (data.success || data.rates) {
            set({
              exchangeRates: data.rates,
              lastUpdated: data.lastUpdate,
              isLoading: false,
              error: data.success ? null : data.error,
            });
          } else {
            throw new Error("Invalid response format");
          }
        } catch (error) {
          console.error("Error fetching exchange rates:", error);
          set({
            isLoading: false,
            error: "Failed to fetch exchange rates",
          });
        }
      },
    }),
    {
      name: "currency-storage",
      partialize: (state) => ({
        currency: state.currency,
        exchangeRates: state.exchangeRates,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);
