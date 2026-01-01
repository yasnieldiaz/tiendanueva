"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Search,
  ChevronDown,
  LogOut,
  Settings,
  Package,
} from "lucide-react";
import { useCart } from "@/store/cart";
import LanguageSelector from "./LanguageSelector";
import CurrencySelector from "./CurrencySelector";

export default function Header() {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { items, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/products`, label: t("products") },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-neutral-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">DP</span>
            </div>
            <span className="font-bold text-xl hidden sm:block">DroneParts</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== `/${locale}` && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-sm font-medium transition-colors ${
                    isActive ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neutral-900 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <AnimatePresence>
              {searchOpen ? (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "200px", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="relative hidden md:block"
                >
                  <input
                    type="text"
                    placeholder={t("search")}
                    autoFocus
                    onBlur={() => setSearchOpen(false)}
                    className="w-full px-4 py-2 bg-neutral-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </motion.div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="hidden md:flex p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </AnimatePresence>

            {/* Currency Selector */}
            <CurrencySelector />

            {/* Language Selector */}
            <LanguageSelector />

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-neutral-900 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
                >
                  <div className="w-6 h-6 bg-neutral-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">
                      {session.user?.name?.[0] || "U"}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 hidden sm:block" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-100 py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b border-neutral-100">
                          <p className="font-medium text-neutral-900 truncate">
                            {session.user?.name}
                          </p>
                          <p className="text-sm text-neutral-500 truncate">
                            {session.user?.email}
                          </p>
                        </div>

                        <Link
                          href={`/${locale}/orders`}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-50"
                        >
                          <Package className="w-4 h-4" />
                          <span>My Orders</span>
                        </Link>

                        {session.user?.role === "ADMIN" && (
                          <Link
                            href={`/${locale}/admin`}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-50"
                          >
                            <Settings className="w-4 h-4" />
                            <span>Admin Panel</span>
                          </Link>
                        )}

                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            signOut({ callbackUrl: `/${locale}` });
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href={`/${locale}/login`}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>{t("login")}</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-neutral-100 overflow-hidden"
            >
              <nav className="py-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg"
                  >
                    {item.label}
                  </Link>
                ))}
                {!session && (
                  <Link
                    href={`/${locale}/login`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-neutral-900 font-medium"
                  >
                    {t("login")}
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
