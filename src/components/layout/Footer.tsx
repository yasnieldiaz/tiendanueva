"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { Mail, Phone, MapPin, Facebook, Shield, Truck, RotateCcw } from "lucide-react";

export default function Footer() {
  const locale = useLocale();

  const categoryLinks = [
    { href: `/${locale}/products?category=xag`, label: "XAG Drony Rolnicze" },
    { href: `/${locale}/products?category=dji-mavic-4`, label: "DJI Mavic 4" },
    { href: `/${locale}/products?category=dji-mini-5-pro`, label: "DJI Mini 5 Pro" },
    { href: `/${locale}/products?category=dji-mavic-3-enterprise`, label: "DJI Enterprise" },
    { href: `/${locale}/products?category=autel-max-4t`, label: "Autel Max 4T" },
    { href: `/${locale}/products?category=akcesoria`, label: "Akcesoria" },
  ];

  const supportLinks = [
    { href: `/${locale}/legal/shipping`, label: "Dostawa i zwrot" },
    { href: `/${locale}/service`, label: "Serwis" },
    { href: `/${locale}/contact`, label: "Kontakt" },
    { href: `/${locale}/faq`, label: "FAQ" },
  ];

  const legalLinks = [
    { href: `/${locale}/legal/terms`, label: "Regulamin" },
    { href: `/${locale}/legal/privacy`, label: "Polityka prywatności" },
    { href: `/${locale}/legal/cookies`, label: "Polityka cookies" },
    { href: `/${locale}/legal/returns`, label: "Zwroty i reklamacje" },
  ];

  return (
    <footer className="bg-neutral-900 text-white">
      {/* Trust Badges */}
      <div className="border-b border-neutral-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-neutral-800 rounded-xl">
                <Truck className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="font-semibold">Bezpłatna dostawa</p>
                <p className="text-sm text-neutral-400">Przy zamówieniach od 5000 zł</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-neutral-800 rounded-xl">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="font-semibold">Gwarancja 2 lata</p>
                <p className="text-sm text-neutral-400">Na wszystkie produkty</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-neutral-800 rounded-xl">
                <RotateCcw className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="font-semibold">14 dni na zwrot</p>
                <p className="text-sm text-neutral-400">Zgodnie z prawem UE</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} className="flex items-center gap-3 mb-6">
              <img
                src="https://drone-partss.com/wp-content/uploads/2024/11/LogoDrone.png"
                alt="Drone-Partss"
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-neutral-400 mb-6 leading-relaxed max-w-md">
              Twój zaufany dostawca profesjonalnych dronów i akcesoriów.
              Oferujemy najwyższej jakości produkty DJI, XAG i Autel z pełną gwarancją i wsparciem technicznym.
            </p>
            <div className="flex items-center gap-4 mb-6">
              <a
                href="https://www.facebook.com/profile.php?id=100063593409895"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-neutral-500" />
                <span className="text-neutral-400 text-sm">ul. Smolna 14, 44-200 Rybnik, Polska</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-neutral-500" />
                <a href="tel:+48784608733" className="text-neutral-400 text-sm hover:text-white">
                  +48 784-608-733
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-neutral-500" />
                <a href="mailto:admin@drone-partss.com" className="text-neutral-400 text-sm hover:text-white">
                  admin@drone-partss.com
                </a>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Kategorie</h3>
            <ul className="space-y-2">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Obsługa klienta</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Informacje prawne</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* EU Compliance */}
      <div className="border-t border-neutral-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-neutral-400">
              <span>Platforma ODR:</span>
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline text-xs sm:text-sm break-all sm:break-normal"
              >
                ec.europa.eu/consumers/odr
              </a>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <span className="text-neutral-400 text-sm">Zgodność z:</span>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <span className="px-2 py-1 bg-blue-900/50 text-blue-300 text-[10px] sm:text-xs rounded">RODO/GDPR</span>
                <span className="px-2 py-1 bg-green-900/50 text-green-300 text-[10px] sm:text-xs rounded">PSD2</span>
                <span className="px-2 py-1 bg-orange-900/50 text-orange-300 text-[10px] sm:text-xs rounded whitespace-nowrap">Dyrektywa 2011/83/UE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods & Copyright */}
      <div className="border-t border-neutral-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <span className="text-neutral-500 text-sm">Płatności:</span>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <div className="px-2 sm:px-3 py-1.5 bg-neutral-800 rounded text-[10px] sm:text-xs font-bold">PayPal</div>
                <div className="px-2 sm:px-3 py-1.5 bg-[#1A1F71] rounded text-[10px] sm:text-xs font-bold">VISA</div>
                <div className="px-2 sm:px-3 py-1.5 bg-neutral-700 rounded text-[10px] sm:text-xs font-bold">Mastercard</div>
                <div className="px-2 sm:px-3 py-1.5 bg-[#635BFF] rounded text-[10px] sm:text-xs font-bold">stripe</div>
                <div className="px-2 sm:px-3 py-1.5 bg-black border border-neutral-700 rounded text-[10px] sm:text-xs font-bold">Apple Pay</div>
              </div>
            </div>
            <p className="text-neutral-500 text-sm text-center">
              © {new Date().getFullYear()} Drone-Partss. Wszelkie prawa zastrzeżone.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
