import { NextResponse } from "next/server";

// Cache exchange rates for 1 hour
let cachedRates: { rates: Record<string, number>; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export async function GET() {
  try {
    // Check if we have valid cached rates
    if (cachedRates && Date.now() - cachedRates.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        rates: cachedRates.rates,
        cached: true,
        lastUpdate: new Date(cachedRates.timestamp).toISOString(),
      });
    }

    // Fetch from Frankfurter API (free, no API key required)
    // Using PLN as base currency
    const response = await fetch(
      "https://api.frankfurter.app/latest?from=PLN&to=EUR,USD",
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates");
    }

    const data = await response.json();

    // Convert to our format (rates from PLN to other currencies)
    const rates = {
      PLN: 1,
      EUR: data.rates.EUR,
      USD: data.rates.USD,
    };

    // Update cache
    cachedRates = {
      rates,
      timestamp: Date.now(),
    };

    return NextResponse.json({
      success: true,
      rates,
      cached: false,
      lastUpdate: new Date().toISOString(),
      source: "Frankfurter API (ECB data)",
    });
  } catch (error) {
    console.error("Error fetching exchange rates:", error);

    // Return fallback rates if API fails
    const fallbackRates = {
      PLN: 1,
      EUR: 0.23,
      USD: 0.25,
    };

    return NextResponse.json({
      success: false,
      rates: fallbackRates,
      error: "Failed to fetch live rates, using fallback",
      lastUpdate: new Date().toISOString(),
    });
  }
}
