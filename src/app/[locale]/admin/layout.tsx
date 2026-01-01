"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
} from "lucide-react";
import { signOut } from "next-auth/react";

// Translations object for admin navigation
const translations = {
  es: {
    dashboard: "Dashboard",
    products: "Productos",
    orders: "Pedidos",
    customers: "Clientes",
    categories: "Categorías",
    settings: "Configuración",
    logout: "Cerrar sesión",
    goToStore: "Ir a la tienda",
  },
  en: {
    dashboard: "Dashboard",
    products: "Products",
    orders: "Orders",
    customers: "Customers",
    categories: "Categories",
    settings: "Settings",
    logout: "Logout",
    goToStore: "Go to Store",
  },
  pl: {
    dashboard: "Dashboard",
    products: "Produkty",
    orders: "Zamówienia",
    customers: "Klienci",
    categories: "Kategorie",
    settings: "Ustawienia",
    logout: "Wyloguj się",
    goToStore: "Idź do sklepu",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const t = translations[locale as keyof typeof translations] || translations.es;

  const navItems = useMemo(() => [
    { href: `/${locale}/admin`, icon: LayoutDashboard, label: t.dashboard },
    { href: `/${locale}/admin/products`, icon: Package, label: t.products },
    { href: `/${locale}/admin/orders`, icon: ShoppingCart, label: t.orders },
    { href: `/${locale}/admin/customers`, icon: Users, label: t.customers },
    { href: `/${locale}/admin/categories`, icon: Tags, label: t.categories },
    { href: `/${locale}/admin/settings`, icon: Settings, label: t.settings },
  ], [locale, t]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${locale}/login`);
    } else if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push(`/${locale}`);
    }
  }, [status, session, router, locale]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-neutral-900 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <span className="font-semibold">Admin Panel</span>
        <div className="w-10" />
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-neutral-900 text-white z-50 transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <Link href={`/${locale}/admin`} className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-white rounded-xl overflow-hidden">
              <Image
                src="https://drone-partss.com/wp-content/uploads/2024/11/LogoDrone.png"
                alt="Drone-Partss Logo"
                fill
                className="object-contain p-1"
                sizes="40px"
              />
            </div>
            <div>
              <p className="font-semibold">Drone-Partss</p>
              <p className="text-xs text-neutral-400">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-white text-neutral-900"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Go to Store Button */}
        <div className="px-4 mt-6">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">{t.goToStore}</span>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-800">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">
                {session?.user?.name?.[0] || "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session?.user?.name}</p>
              <p className="text-xs text-neutral-400 truncate">{session?.user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: `/${locale}` })}
            className="flex items-center gap-3 w-full px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">{t.logout}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
