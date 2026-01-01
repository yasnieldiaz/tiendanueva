"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  const productLinks = [
    { href: `/${locale}/products?category=drones`, label: "Drones" },
    { href: `/${locale}/products?category=batteries`, label: "Batteries" },
    { href: `/${locale}/products?category=propellers`, label: "Propellers" },
    { href: `/${locale}/products?category=cameras`, label: "Cameras" },
    { href: `/${locale}/products?category=accessories`, label: "Accessories" },
  ];

  const supportLinks = [
    { href: `/${locale}/shipping`, label: t("shipping") },
    { href: `/${locale}/returns`, label: t("returns") },
    { href: `/${locale}/contact`, label: t("contact") },
  ];

  const companyLinks = [
    { href: `/${locale}/about`, label: t("aboutUs") },
    { href: `/${locale}/privacy`, label: t("privacy") },
    { href: `/${locale}/terms`, label: t("terms") },
  ];

  return (
    <footer className="bg-neutral-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href={`/${locale}`} className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <span className="text-neutral-900 font-bold text-lg">DP</span>
              </div>
              <span className="font-bold text-xl">DroneParts</span>
            </Link>
            <p className="text-neutral-400 mb-6 leading-relaxed">
              {t("description")}
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-neutral-700 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-neutral-700 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-neutral-700 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-neutral-700 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold text-lg mb-6">{t("products")}</h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-6">{t("support")}</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-6">{t("contact")}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-neutral-400 mt-0.5 flex-shrink-0" />
                <span className="text-neutral-400">
                  ul. Przykładowa 123<br />
                  00-001 Warszawa, Poland
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                <a
                  href="tel:+48123456789"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  +48 123 456 789
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                <a
                  href="mailto:info@drone-partss.com"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  info@drone-partss.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-neutral-400 text-sm">
              © {new Date().getFullYear()} DroneParts. {t("rights")}
            </p>
            <div className="flex items-center gap-6">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6 opacity-50" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-50" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6 opacity-50" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
