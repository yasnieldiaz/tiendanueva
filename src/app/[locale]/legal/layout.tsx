"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import {
  Shield,
  FileText,
  Truck,
  Phone,
  Wrench,
  ChevronRight,
  Home,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

const translations = {
  es: {
    legalInfo: "Información Legal",
    subtitle: "Todo lo que necesitas saber sobre nuestras políticas",
    privacy: "Política de Privacidad",
    terms: "Términos y Condiciones",
    shipping: "Envío y Devoluciones",
    contact: "Contacto",
    service: "Servicio Técnico",
    home: "Inicio",
    needHelp: "¿Necesitas ayuda?",
    helpText: "Nuestro equipo está disponible para responder tus preguntas.",
    contactUs: "Contáctanos",
  },
  en: {
    legalInfo: "Legal Information",
    subtitle: "Everything you need to know about our policies",
    privacy: "Privacy Policy",
    terms: "Terms and Conditions",
    shipping: "Shipping & Returns",
    contact: "Contact",
    service: "Technical Service",
    home: "Home",
    needHelp: "Need help?",
    helpText: "Our team is available to answer your questions.",
    contactUs: "Contact Us",
  },
  pl: {
    legalInfo: "Informacje Prawne",
    subtitle: "Wszystko, co musisz wiedzieć o naszych zasadach",
    privacy: "Polityka Prywatności",
    terms: "Regulamin",
    shipping: "Dostawa i Zwroty",
    contact: "Kontakt",
    service: "Serwis Techniczny",
    home: "Strona główna",
    needHelp: "Potrzebujesz pomocy?",
    helpText: "Nasz zespół jest dostępny, aby odpowiedzieć na Twoje pytania.",
    contactUs: "Skontaktuj się",
  },
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = translations[locale as keyof typeof translations] || translations.pl;

  const navItems = [
    { href: `/${locale}/legal/privacy`, icon: Shield, label: t.privacy },
    { href: `/${locale}/legal/terms`, icon: FileText, label: t.terms },
    { href: `/${locale}/legal/shipping`, icon: Truck, label: t.shipping },
    { href: `/${locale}/contact`, icon: Phone, label: t.contact },
    { href: `/${locale}/service`, icon: Wrench, label: t.service },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-neutral-50">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-4">
            <Link
              href={`/${locale}`}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>{t.home}</span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{t.legalInfo}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {t.legalInfo}
          </h1>
          <p className="text-neutral-400 text-lg">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden sticky top-4">
              <nav className="p-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-neutral-400"}`} />
                      <span className="font-medium">{item.label}</span>
                      {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </Link>
                  );
                })}
              </nav>

              {/* Help Card */}
              <div className="p-4 border-t border-neutral-100">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <h3 className="font-semibold text-neutral-900 mb-1">
                    {t.needHelp}
                  </h3>
                  <p className="text-sm text-neutral-600 mb-3">
                    {t.helpText}
                  </p>
                  <Link
                    href={`/${locale}/contact`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    {t.contactUs}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 md:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
      </div>
      <Footer />
      <CartDrawer />
    </>
  );
}
