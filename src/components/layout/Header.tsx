"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
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
  ChevronRight,
  LogOut,
  Settings,
  Package,
  Grid3X3,
  Phone,
  Loader2,
} from "lucide-react";
import { useCart } from "@/store/cart";
import { useCurrency } from "@/store/currency";
import LanguageSelector from "./LanguageSelector";
import CurrencySelector from "./CurrencySelector";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: { url: string }[];
  brand: { name: string } | null;
}

// Main navigation menu items - using translation keys
const mainNavItems = [
  { key: "home", href: "", isHome: true },
  { key: "service", href: "/service" },
  { key: "contact", href: "/contact" },
  { key: "shipping", href: "/legal/shipping" },
  { key: "terms", href: "/legal/terms" },
  { key: "privacy", href: "/legal/privacy" },
];

// Menu categories structure based on drone-partss.com
const menuCategories = [
  {
    name: "XAG",
    slug: "xag",
    subcategories: [],
  },
  {
    name: "DJI Mavic 4",
    slug: "dji-mavic-4",
    subcategories: [],
  },
  {
    name: "DJI Mini 5 Pro",
    slug: "dji-mini-5-pro",
    subcategories: [],
  },
  {
    name: "DJI Enterprises",
    slug: "dji-enterprises",
    subcategories: [
      { name: "DJI Mavic 3 Enterprise", slug: "dji-mavic-3-enterprise" },
      { name: "DJI M30T", slug: "dji-m30t" },
      { name: "DJI Matrice 4 Series", slug: "dji-matrice-4" },
      { name: "DJI Matrice 350 RTK", slug: "dji-matrice-350-rtk" },
      { name: "DJI Inspire 2", slug: "dji-inspire-2" },
    ],
  },
  {
    name: "Autel Robotics",
    slug: "autel-robotics",
    subcategories: [
      { name: "Autel Max 4T", slug: "autel-max-4t" },
      { name: "Autel Evo II V3", slug: "autel-evo-ii-v3" },
      { name: "Autel Evo 2 V2", slug: "autel-evo-2-v2" },
      { name: "Autel Lite/Lite+ Części", slug: "autel-lite" },
    ],
  },
  {
    name: "DJI Mavic 3",
    slug: "dji-mavic-3",
    subcategories: [
      { name: "DJI Mavic 3 Pro", slug: "dji-mavic-3-pro" },
      { name: "DJI Mavic 3 Classic", slug: "dji-mavic-3-classic" },
    ],
  },
  {
    name: "DJI Mavic Air",
    slug: "dji-mavic-air",
    subcategories: [
      { name: "DJI Mavic Air 3", slug: "dji-mavic-air-3" },
      { name: "DJI Mavic Air 2S", slug: "dji-mavic-air-2s" },
      { name: "DJI Mavic Air 2", slug: "dji-mavic-air-2" },
      { name: "DJI Mavic Air", slug: "dji-mavic-air-1" },
    ],
  },
  {
    name: "DJI Mini Series",
    slug: "dji-mini",
    subcategories: [
      { name: "DJI Mini 4 Pro", slug: "dji-mini-4-pro" },
      { name: "DJI Mini 3 Pro", slug: "dji-mini-3-pro" },
      { name: "DJI Mini 3", slug: "dji-mini-3" },
      { name: "DJI Mini 2", slug: "dji-mini-2" },
      { name: "DJI Mini SE", slug: "dji-mini-se" },
    ],
  },
  {
    name: "DJI Avata",
    slug: "dji-avata",
    subcategories: [
      { name: "DJI Avata 2", slug: "dji-avata-2" },
      { name: "DJI Avata", slug: "dji-avata-1" },
    ],
  },
  {
    name: "DJI FPV",
    slug: "dji-fpv",
    subcategories: [],
  },
  {
    name: "DJI Neo",
    slug: "dji-neo",
    subcategories: [],
  },
  {
    name: "DJI Flip",
    slug: "dji-flip",
    subcategories: [],
  },
  {
    name: "Akcesoria",
    slug: "akcesoria",
    subcategories: [],
  },
];

export default function Header() {
  const t = useTranslations("common");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { items, openCart } = useCart();
  const { formatPrice } = useCurrency();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Debounced live search
  const searchProducts = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=6`);
      const data = await res.json();
      setSearchResults(data.products || []);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchProducts(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchProducts]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search submission
  const handleSearch = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${locale}/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setShowResults(false);
      setSearchQuery("");
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
    if (e.key === "Escape") {
      setShowResults(false);
    }
  };

  const handleResultClick = (slug: string) => {
    router.push(`/${locale}/product/${slug}`);
    setShowResults(false);
    setSearchQuery("");
    setSearchOpen(false);
  };

  // Close categories menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setCategoriesOpen(false);
        setActiveCategory(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check if current path matches nav item
  const isNavActive = (href: string, isHome?: boolean) => {
    if (isHome) {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.startsWith(`/${locale}${href}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-neutral-900 text-white text-xs py-2">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>Bezpłatna dostawa od 5000 zł</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">Ekonomiczne wysyłki do Europy</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+48784608733" className="flex items-center gap-1 hover:text-neutral-300">
              <Phone className="w-3 h-3" />
              +48 784-608-733
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Image
                src="https://drone-partss.com/wp-content/uploads/2024/11/LogoDrone.png"
                alt="Drone-Partss Logo"
                fill
                className="object-contain"
                sizes="48px"
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg text-neutral-900">Drone-Partss</span>
              <p className="text-xs text-neutral-500">Oficjalny dystrybutor XAG</p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div ref={searchRef} className="hidden lg:flex flex-1 max-w-xl mx-8 relative">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                  placeholder={tNav("search")}
                  className="w-full px-4 py-2.5 pl-10 pr-20 bg-neutral-100 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {isSearching ? (
                  <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 animate-spin" />
                ) : (
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                )}
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
                >
                  {tNav("searchButton")}
                </button>
              </div>
            </form>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {showResults && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-neutral-200 overflow-hidden z-50"
                >
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleResultClick(product.slug)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-neutral-50 transition-colors text-left"
                    >
                      <div className="w-12 h-12 bg-neutral-100 rounded-lg flex-shrink-0 overflow-hidden relative">
                        {product.images?.[0]?.url ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            className="object-contain p-1"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">🛸</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">{product.name}</p>
                        {product.brand && (
                          <p className="text-xs text-neutral-500">{product.brand.name}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-blue-600">{formatPrice(product.price)}</p>
                        <p className="text-xs text-neutral-400">+ VAT</p>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={handleSearch}
                    className="w-full p-3 text-sm text-blue-600 font-medium bg-neutral-50 hover:bg-neutral-100 transition-colors"
                  >
                    Zobacz wszystkie wyniki dla &quot;{searchQuery}&quot;
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search - Mobile */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

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
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
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
                          <span>Moje zamówienia</span>
                        </Link>

                        {session.user?.role === "ADMIN" && (
                          <Link
                            href={`/${locale}/admin`}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-50"
                          >
                            <Settings className="w-4 h-4" />
                            <span>Panel Admin</span>
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
                          <span>Wyloguj</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href={`/${locale}/login`}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>{t("login")}</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden pb-4 overflow-hidden"
            >
              <form onSubmit={handleSearch} className="relative flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder={tNav("search")}
                    autoFocus
                    className="w-full px-4 py-2.5 pl-10 bg-neutral-100 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {tNav("searchButton")}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Navigation Menu - Pill Style with Categories */}
      <div className="hidden lg:block border-t border-neutral-200 bg-slate-100" ref={categoriesRef}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6 py-3">
            {/* All Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Grid3X3 className="w-4 h-4" />
                <span>Wszystkie kategorie</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${categoriesOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {categoriesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-neutral-200 py-2 z-50"
                  >
                    {menuCategories.map((category) => (
                      <div
                        key={category.slug}
                        className="relative"
                        onMouseEnter={() => setActiveCategory(category.slug)}
                        onMouseLeave={() => setActiveCategory(null)}
                      >
                        <Link
                          href={`/${locale}/products?category=${category.slug}`}
                          onClick={() => setCategoriesOpen(false)}
                          className="flex items-center justify-between px-4 py-2.5 text-sm text-neutral-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <span>{category.name}</span>
                          {category.subcategories.length > 0 && (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </Link>

                        {/* Subcategories */}
                        {category.subcategories.length > 0 && activeCategory === category.slug && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="absolute left-full top-0 ml-1 w-56 bg-white rounded-lg shadow-xl border border-neutral-200 py-2"
                          >
                            {category.subcategories.map((sub) => (
                              <Link
                                key={sub.slug}
                                href={`/${locale}/products?category=${sub.slug}`}
                                onClick={() => setCategoriesOpen(false)}
                                className="block px-4 py-2 text-sm text-neutral-700 hover:bg-blue-50 hover:text-blue-600"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Main Nav Items - Pill Style */}
            {mainNavItems.map((item) => {
              const isActive = isNavActive(item.href, item.isHome);
              return (
                <Link
                  key={item.key}
                  href={item.isHome ? `/${locale}` : `/${locale}${item.href}`}
                  className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-neutral-200 overflow-hidden bg-white"
          >
            <nav className="py-4 px-4 space-y-1 max-h-[70vh] overflow-y-auto">
              {/* Main Navigation */}
              {mainNavItems.map((item) => {
                const isActive = isNavActive(item.href, item.isHome);
                return (
                  <Link
                    key={item.key}
                    href={item.isHome ? `/${locale}` : `/${locale}${item.href}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg font-medium ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    {t(item.key)}
                  </Link>
                );
              })}

              <div className="border-t border-neutral-100 my-2"></div>
              <p className="px-4 py-2 text-xs font-semibold text-neutral-400 uppercase">Kategorie</p>

              {menuCategories.map((category) => (
                <div key={category.slug}>
                  <Link
                    href={`/${locale}/products?category=${category.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2.5 text-neutral-700 hover:bg-neutral-50 rounded-lg"
                  >
                    {category.name}
                  </Link>
                  {category.subcategories.length > 0 && (
                    <div className="pl-4">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/${locale}/products?category=${sub.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-neutral-500 hover:bg-neutral-50 rounded-lg"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {!session && (
                <>
                  <div className="border-t border-neutral-100 my-2"></div>
                  <Link
                    href={`/${locale}/login`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 bg-blue-600 text-white text-center font-medium rounded-lg"
                  >
                    {t("login")}
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
