"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ShoppingBag, Truck, Shield, Package, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";

const brands = [
  { name: "DJI", logo: "/brands/dji.png" },
  { name: "Autel", logo: "/brands/autel.png" },
  { name: "XAG", logo: "/brands/xag.png" },
  { name: "FIMI", logo: "/brands/fimi.png" },
];

const stats = [
  { key: "products", value: "500+", icon: Package },
  { key: "brands", value: "10+", icon: ShoppingBag },
  { key: "shipping", value: "EU", icon: Truck },
  { key: "warranty", value: "12m", icon: Shield },
];

export default function HomePage() {
  const t = useTranslations("hero");
  const tNav = useTranslations("nav");

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              Drone<span className="text-blue-500">Parts</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/products" className="text-white/70 hover:text-white transition-colors">
                {tNav("products")}
              </Link>
              <Link href="/categories" className="text-white/70 hover:text-white transition-colors">
                {tNav("categories")}
              </Link>
              <Link href="/brands" className="text-white/70 hover:text-white transition-colors">
                {tNav("brands")}
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/cart"
                className="relative p-2 text-white/70 hover:text-white transition-colors"
              >
                <ShoppingBag className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full text-xs flex items-center justify-center">
                  0
                </span>
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
              >
                {tNav("login")}
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-colors"
              >
                {tNav("register")}
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/30 rounded-full blur-[150px]"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[150px]"
          />
          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-6">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  Official Distributor
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              >
                {t("title")}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  {t("titleHighlight")}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-white/60 mb-8 max-w-lg"
              >
                {t("subtitle")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-wrap gap-4 mb-12"
              >
                <Link href="/products">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group flex items-center gap-2 px-8 py-4 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/25"
                  >
                    {t("cta")}
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </Link>
                <Link href="/brands">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-8 py-4 bg-white/5 text-white font-semibold rounded-full border border-white/10 hover:bg-white/10 transition-all"
                  >
                    {t("ctaSecondary")}
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="grid grid-cols-4 gap-4"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-white/5 flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-white/50">{t(`stats.${stat.key}`)}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right - Drone Image Placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square">
                {/* Animated circles */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border border-white/10 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-8 border border-white/10 rounded-full"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-16 border border-blue-500/20 rounded-full"
                />

                {/* Center drone placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center border border-white/10"
                  >
                    <span className="text-6xl">🛸</span>
                  </motion.div>
                </div>

                {/* Floating brand badges */}
                {brands.map((brand, index) => {
                  const positions = [
                    "top-0 left-1/2 -translate-x-1/2",
                    "right-0 top-1/2 -translate-y-1/2",
                    "bottom-0 left-1/2 -translate-x-1/2",
                    "left-0 top-1/2 -translate-y-1/2",
                  ];
                  return (
                    <motion.div
                      key={brand.name}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      className={`absolute ${positions[index]} px-4 py-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/10`}
                    >
                      <span className="font-semibold">{brand.name}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products Section Preview */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-white/60">Coming soon - Browse our collection of premium drone parts</p>
          </motion.div>

          {/* Product Cards Placeholder */}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden group cursor-pointer"
              >
                <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <Package className="w-16 h-16 text-white/20 group-hover:text-blue-500/50 transition-colors" />
                </div>
                <div className="p-4">
                  <div className="h-4 bg-white/10 rounded mb-2 w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                  <div className="mt-4 flex items-center justify-between">
                    <div className="h-6 bg-blue-500/20 rounded w-20" />
                    <div className="w-10 h-10 bg-white/5 rounded-full" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-2xl font-bold">
              Drone<span className="text-blue-500">Parts</span>
            </div>
            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} DroneParts Store. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
