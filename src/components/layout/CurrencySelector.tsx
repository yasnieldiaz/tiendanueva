"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useCurrency, Currency } from "@/store/currency";

const currencies: { code: Currency; symbol: string; name: string }[] = [
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty" },
  { code: "USD", symbol: "$", name: "US Dollar" },
];

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentCurrency = currencies.find((c) => c.code === currency) || currencies[0];

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
            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden z-50"
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
                  <div>
                    <p className="font-medium text-neutral-900">{curr.code}</p>
                    <p className="text-xs text-neutral-500">{curr.name}</p>
                  </div>
                  {currency === curr.code && (
                    <span className="ml-auto text-green-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
