"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { ShoppingCart, ChevronRight, ChevronLeft, Play, Truck, Shield, Headphones, CreditCard } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

// Hero slides data
const heroSlides = [
  {
    id: 1,
    title: "DJI Mavic 3 Pro",
    subtitle: "Triple-Camera Flagship",
    description: "Hasselblad camera system with 4/3 CMOS sensor. 43-min flight time.",
    price: "€2,199",
    gradient: "from-slate-900 to-slate-800",
  },
  {
    id: 2,
    title: "DJI Mini 4 Pro",
    subtitle: "Mini Drone, Mighty Results",
    description: "Under 249g. 4K/60fps HDR Video. Omnidirectional obstacle sensing.",
    price: "€799",
    gradient: "from-blue-900 to-blue-800",
  },
  {
    id: 3,
    title: "Autel EVO II Pro",
    subtitle: "Professional Imaging",
    description: "1-inch sensor. 6K video. 42-minute flight time.",
    price: "€1,699",
    gradient: "from-orange-900 to-orange-800",
  },
];

// Categories
const categories = [
  { name: "Camera Drones", slug: "camera-drones", count: 24 },
  { name: "FPV Drones", slug: "fpv-drones", count: 12 },
  { name: "Agriculture", slug: "agriculture", count: 8 },
  { name: "Accessories", slug: "accessories", count: 156 },
  { name: "Batteries", slug: "batteries", count: 48 },
  { name: "Propellers", slug: "propellers", count: 64 },
];

// Featured products
const featuredProducts = [
  {
    id: 1,
    name: "DJI Mavic 3 Intelligent Flight Battery",
    brand: "DJI",
    price: 199,
    category: "Batteries",
    icon: "🔋",
  },
  {
    id: 2,
    name: "DJI Mini 4 Pro Propellers (Set of 4)",
    brand: "DJI",
    price: 29,
    category: "Propellers",
    icon: "🌀",
  },
  {
    id: 3,
    name: "Autel EVO II Motor (CW)",
    brand: "Autel",
    price: 89,
    category: "Motors",
    icon: "⚙️",
  },
  {
    id: 4,
    name: "DJI RC Controller",
    brand: "DJI",
    price: 299,
    category: "Controllers",
    icon: "🎮",
  },
];

// Drone category products
const droneProducts = [
  {
    id: 1,
    name: "DJI Mavic 3 Classic",
    description: "Hasselblad Camera, 46-Min Flight Time",
    price: 1469,
    brand: "DJI",
  },
  {
    id: 2,
    name: "DJI Air 3",
    description: "Dual Primary Cameras, 46-Min Flight Time",
    price: 1099,
    brand: "DJI",
  },
  {
    id: 3,
    name: "DJI Mini 3",
    description: "Lightweight, 38-Min Flight Time",
    price: 489,
    brand: "DJI",
  },
  {
    id: 4,
    name: "Autel EVO Lite+",
    description: "1-inch Sensor, 40-Min Flight Time",
    price: 1149,
    brand: "Autel",
  },
];

export default function HomePage() {
  const t = useTranslations("hero");
  const tNav = useTranslations("nav");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-neutral-900 text-white text-sm">
        <div className="max-w-[1504px] mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-neutral-300 transition-colors">Store</Link>
            <Link href="/guides" className="hover:text-neutral-300 transition-colors">Guides</Link>
            <Link href="/support" className="hover:text-neutral-300 transition-colors">Support</Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-neutral-400">Free shipping over €100</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200">
        <div className="max-w-[1504px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DP</span>
              </div>
              <span className="text-xl font-semibold text-neutral-900">DroneParts</span>
            </Link>

            {/* Category Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="text-neutral-700 hover:text-neutral-900 font-medium transition-colors py-4 border-b-2 border-transparent hover:border-neutral-900"
                >
                  {category.name}
                </Link>
              ))}
              <Link
                href="/categories"
                className="text-neutral-500 hover:text-neutral-900 font-medium transition-colors flex items-center gap-1"
              >
                More
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link
                href="/cart"
                className="relative p-2 text-neutral-700 hover:text-neutral-900 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-medium">
                  0
                </span>
              </Link>
              <Link
                href="/login"
                className="text-neutral-700 hover:text-neutral-900 font-medium transition-colors"
              >
                {tNav("login")}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Carousel */}
      <section className="relative bg-neutral-100 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`relative min-h-[600px] bg-gradient-to-r ${heroSlides[currentSlide].gradient}`}
          >
            <div className="max-w-[1504px] mx-auto px-6 py-20">
              <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[500px]">
                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-full mb-6">
                    New Release
                  </span>
                  <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                    {heroSlides[currentSlide].title}
                  </h1>
                  <p className="text-2xl text-white/90 font-medium mb-4">
                    {heroSlides[currentSlide].subtitle}
                  </p>
                  <p className="text-lg text-white/70 mb-8 max-w-lg">
                    {heroSlides[currentSlide].description}
                  </p>
                  <div className="flex items-center gap-6">
                    <span className="text-3xl font-bold text-white">
                      From {heroSlides[currentSlide].price}
                    </span>
                    <Link href="/products">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-8 py-3 bg-white text-neutral-900 font-semibold rounded-lg hover:bg-neutral-100 transition-colors"
                      >
                        Buy Now
                      </motion.button>
                    </Link>
                    <button className="flex items-center gap-2 text-white hover:text-white/80 transition-colors">
                      <Play className="w-5 h-5" />
                      <span className="font-medium">Watch Video</span>
                    </button>
                  </div>
                </motion.div>

                {/* Visual Element */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative flex items-center justify-center"
                >
                  <div className="relative w-full max-w-md aspect-square">
                    <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl" />
                    <motion.div
                      animate={{ y: [-10, 10, -10] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-64 h-64 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
                        <span className="text-[120px]">🛸</span>
                      </div>
                    </motion.div>
                    {/* Orbiting elements */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0"
                    >
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                        <span className="text-2xl">📷</span>
                      </div>
                    </motion.div>
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-8"
                    >
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                        <span className="text-xl">🔋</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <button
            onClick={prevSlide}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentSlide(i);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === currentSlide ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-6 border-b border-neutral-200">
        <div className="max-w-[1504px] mx-auto px-6">
          <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-700 font-medium whitespace-nowrap transition-colors"
              >
                {category.name}
                <span className="text-neutral-400 text-sm">({category.count})</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Camera Drones Section */}
      <section className="py-16">
        <div className="max-w-[1504px] mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">Camera Drones</h2>
              <p className="text-neutral-500 mt-1">Professional aerial photography solutions</p>
            </div>
            <Link
              href="/category/camera-drones"
              className="flex items-center gap-1 text-neutral-700 hover:text-neutral-900 font-medium transition-colors"
            >
              Buying Guide
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {droneProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/product/${product.id}`}>
                  <div className="group bg-neutral-50 rounded-2xl p-6 hover:bg-neutral-100 transition-colors cursor-pointer">
                    <div className="aspect-square relative mb-4 flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl">
                      <motion.span
                        className="text-7xl"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        🛸
                      </motion.span>
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-neutral-900 text-white text-xs font-medium rounded-full">
                          {product.brand}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-neutral-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-neutral-500 mb-3">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-neutral-900">
                        From €{product.price.toLocaleString()}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
                      >
                        Buy Now
                      </motion.button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Accessories Banner */}
      <section className="py-16 bg-neutral-900">
        <div className="max-w-[1504px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-neutral-400 text-sm font-medium uppercase tracking-wider">Accessories</span>
              <h2 className="text-4xl font-bold text-white mt-2 mb-4">
                Extend Your Flying Experience
              </h2>
              <p className="text-neutral-400 text-lg mb-8 max-w-lg">
                From batteries and propellers to ND filters and carrying cases.
                Find everything you need to maximize your drone&apos;s potential.
              </p>
              <Link href="/category/accessories">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 bg-white text-neutral-900 font-semibold rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  Shop Accessories
                </motion.button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {featuredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/product/${product.id}`}>
                    <div className="group bg-neutral-800 rounded-xl p-4 hover:bg-neutral-700 transition-colors cursor-pointer">
                      <div className="aspect-square relative mb-3 bg-neutral-700/50 rounded-lg flex items-center justify-center">
                        <motion.span
                          className="text-5xl"
                          whileHover={{ scale: 1.2 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {product.icon}
                        </motion.span>
                      </div>
                      <span className="text-xs text-neutral-400 font-medium">{product.brand}</span>
                      <h3 className="text-sm font-medium text-white mt-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-white font-bold mt-2">€{product.price}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-b border-neutral-200">
        <div className="max-w-[1504px] mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: "Free Shipping", desc: "On orders over €100" },
              { icon: Shield, title: "Warranty", desc: "12 months manufacturer warranty" },
              { icon: Headphones, title: "24/7 Support", desc: "Expert assistance available" },
              { icon: CreditCard, title: "Secure Payment", desc: "100% secure checkout" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="p-3 bg-neutral-100 rounded-xl">
                  <feature.icon className="w-6 h-6 text-neutral-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{feature.title}</h3>
                  <p className="text-sm text-neutral-500 mt-1">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-[1504px] mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-neutral-900 mb-3">
              Stay Updated
            </h2>
            <p className="text-neutral-500 mb-6">
              Subscribe to our newsletter for exclusive deals and new product announcements.
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-neutral-900 text-white font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-white border-t border-neutral-200">
        <div className="max-w-[1504px] mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DP</span>
                </div>
                <span className="text-xl font-semibold text-neutral-900">DroneParts</span>
              </div>
              <p className="text-neutral-500 max-w-sm">
                Official distributor of drone parts and accessories. DJI, Autel, XAG, FIMI and more brands.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 mb-4">Products</h4>
              <ul className="space-y-3 text-neutral-500">
                <li><Link href="/category/camera-drones" className="hover:text-neutral-900 transition-colors">Camera Drones</Link></li>
                <li><Link href="/category/fpv-drones" className="hover:text-neutral-900 transition-colors">FPV Drones</Link></li>
                <li><Link href="/category/accessories" className="hover:text-neutral-900 transition-colors">Accessories</Link></li>
                <li><Link href="/category/batteries" className="hover:text-neutral-900 transition-colors">Batteries</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 mb-4">Support</h4>
              <ul className="space-y-3 text-neutral-500">
                <li><Link href="/contact" className="hover:text-neutral-900 transition-colors">Contact</Link></li>
                <li><Link href="/shipping" className="hover:text-neutral-900 transition-colors">Shipping Info</Link></li>
                <li><Link href="/returns" className="hover:text-neutral-900 transition-colors">Returns</Link></li>
                <li><Link href="/faq" className="hover:text-neutral-900 transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 mb-4">Contact</h4>
              <ul className="space-y-3 text-neutral-500">
                <li>admin@drone-partss.com</li>
                <li>+48 784 608 733</li>
                <li>ul. Smolna 14</li>
                <li>44-200 Rybnik, Poland</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-neutral-500 text-sm">
              © {new Date().getFullYear()} DroneParts Store. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-neutral-500">
              <Link href="/privacy" className="hover:text-neutral-900 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-neutral-900 transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-neutral-900 transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
