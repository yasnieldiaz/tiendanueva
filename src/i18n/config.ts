export const locales = ["pl", "es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pl";
