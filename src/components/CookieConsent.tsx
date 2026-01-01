"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Settings, Check } from "lucide-react";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always required
  analytics: false,
  marketing: false,
  preferences: false,
};

export default function CookieConsent() {
  const locale = useLocale();
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem("cookie-consent", JSON.stringify(prefs));
    localStorage.setItem("cookie-consent-date", new Date().toISOString());
    setIsVisible(false);

    // Here you would initialize analytics/marketing based on preferences
    if (prefs.analytics) {
      // Initialize Google Analytics, etc.
      console.log("Analytics cookies enabled");
    }
    if (prefs.marketing) {
      // Initialize marketing pixels
      console.log("Marketing cookies enabled");
    }
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setPreferences(allAccepted);
    saveConsent(allAccepted);
  };

  const acceptNecessary = () => {
    saveConsent(defaultPreferences);
  };

  const saveCustom = () => {
    saveConsent(preferences);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4"
      >
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
          {!showSettings ? (
            // Main Banner
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Cookie className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    Ta strona używa plików cookies
                  </h3>
                  <p className="text-sm text-neutral-600 mb-4">
                    Używamy plików cookies i podobnych technologii, aby zapewnić najlepsze doświadczenia na naszej stronie.
                    Niektóre są niezbędne do działania strony, inne pomagają nam ulepszać usługi i personalizować treści.
                    Zgodnie z RODO (GDPR) potrzebujemy Twojej zgody na przetwarzanie danych.{" "}
                    <Link href={`/${locale}/privacy`} className="text-blue-600 hover:underline">
                      Polityka prywatności
                    </Link>
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={acceptAll}
                      className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Akceptuj wszystkie
                    </button>
                    <button
                      onClick={acceptNecessary}
                      className="px-6 py-2.5 bg-neutral-200 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-300 transition-colors"
                    >
                      Tylko niezbędne
                    </button>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="px-6 py-2.5 border border-neutral-300 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Ustawienia
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Settings Panel
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-neutral-900">Ustawienia plików cookies</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Necessary Cookies */}
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-blue-600 rounded-full flex items-center justify-end px-1">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                      <span className="font-medium text-neutral-900">Niezbędne</span>
                    </div>
                    <span className="text-xs text-neutral-500 bg-neutral-200 px-2 py-1 rounded">Zawsze aktywne</span>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Te pliki cookies są niezbędne do działania strony. Bez nich strona nie będzie działać prawidłowo.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setPreferences({ ...preferences, analytics: !preferences.analytics })}
                        className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                          preferences.analytics ? "bg-blue-600 justify-end" : "bg-neutral-300 justify-start"
                        }`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </button>
                      <span className="font-medium text-neutral-900">Analityczne</span>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Pomagają nam zrozumieć, jak użytkownicy korzystają ze strony, co pozwala nam ją ulepszać.
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setPreferences({ ...preferences, marketing: !preferences.marketing })}
                        className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                          preferences.marketing ? "bg-blue-600 justify-end" : "bg-neutral-300 justify-start"
                        }`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </button>
                      <span className="font-medium text-neutral-900">Marketingowe</span>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Używane do wyświetlania spersonalizowanych reklam i śledzenia skuteczności kampanii.
                  </p>
                </div>

                {/* Preferences Cookies */}
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setPreferences({ ...preferences, preferences: !preferences.preferences })}
                        className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                          preferences.preferences ? "bg-blue-600 justify-end" : "bg-neutral-300 justify-start"
                        }`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </button>
                      <span className="font-medium text-neutral-900">Preferencje</span>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Zapamiętują Twoje preferencje, takie jak język czy region, aby dostosować stronę do Twoich potrzeb.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={saveCustom}
                  className="flex-1 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Zapisz ustawienia
                </button>
                <button
                  onClick={acceptAll}
                  className="px-6 py-2.5 bg-neutral-200 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-300 transition-colors"
                >
                  Akceptuj wszystkie
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
