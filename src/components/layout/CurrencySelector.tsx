"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, RefreshCw } from "lucide-react";
import { useCurrency, Currency } from "@/store/currency";

const currencies: { code: Currency; symbol: string; name: string }[] = [
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty" },
  { code: "USD", symbol: "$", name: "US Dollar" },
];

export default function CurrencySelector() {
  const { currency, setCurrency, fetchExchangeRates, isLoading, lastUpdated, exchangeRates } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentCurrency = currencies.find((c) => c.code === currency) || currencies[0];

  // Fetch exchange rates on mount
  useEffect(() => {
    fetchExchangeRates();
  }, [fetchExchangeRates]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
      >
        <span className="font-semibold">{currentCurrency.symbol}</span>
        <span className="hidden sm:inline">{currentCurrency.code}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden z-50"
          >
            <div className="py-1">
              {currencies.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => {
                    setCurrency(curr.code);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-neutral-50 transition-colors ${
                    currency === curr.code ? "bg-neutral-50" : ""
                  }`}
                >
                  <span className="w-8 h-8 flex items-center justify-center bg-neutral-100 rounded-full text-lg font-semibold">
                    {curr.symbol}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">{curr.code}</p>
                    <p className="text-xs text-neutral-500">
                      {curr.code === "PLN"
                        ? "Base currency"
                        : `1 PLN = ${exchangeRates[curr.code].toFixed(4)} ${curr.symbol}`}
                    </p>
                  </div>
                  {currency === curr.code && (
                    <span className="text-green-600">✓</span>
                  )}
                </button>
              ))}
            </div>
            {/* Exchange rate info */}
            <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-100">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>
                  {isLoading ? (
                    <span className="flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Updating...
                    </span>
                  ) : lastUpdated ? (
                    `Updated: ${new Date(lastUpdated).toLocaleTimeString()}`
                  ) : (
                    "Using fallback rates"
                  )}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    fetchExchangeRates();
                  }}
                  className="p-1 hover:bg-neutral-200 rounded transition-colors"
                  title="Refresh rates"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
