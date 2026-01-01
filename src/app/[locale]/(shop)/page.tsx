"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { ChevronRight, ChevronLeft, Play, Truck, Shield, Headphones, CreditCard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "@/store/cart";
import { useCurrency } from "@/store/currency";

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  images: ProductImage[];
  brand: { name: string } | null;
  category: { name: string } | null;
}

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

const categories = [
  { name: "DJI Mavic 4", slug: "dji-mavic-4", icon: "🛸" },
  { name: "DJI Mini 5 Pro", slug: "dji-mini-5-pro", icon: "✈️" },
  { name: "DJI Enterprise", slug: "dji-enterprise", icon: "🎯" },
  { name: "Autel Max", slug: "autel-max", icon: "🎮" },
  { name: "XAG Agricultural", slug: "xag-agricultural", icon: "🌾" },
  { name: "Batteries", slug: "batteries", icon: "🔋" },
];

export default function HomePage() {
  const t = useTranslations("hero");
  const tProducts = useTranslations("products");
  const locale = useLocale();
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products?featured=true&limit=8");
        if (res.ok) {
          const data = await res.json();
          setFeaturedProducts(data.products || []);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

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
    <div className="bg-white">
      {/* Hero Carousel */}
      <section className="relative bg-neutral-100 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`relative min-h-[500px] md:min-h-[600px] bg-gradient-to-r ${heroSlides[currentSlide].gradient}`}
          >
            <div className="container mx-auto px-4 py-16 md:py-20">
              <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[400px] md:min-h-[500px]">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-full mb-6">
                    {t("titleHighlight")}
                  </span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                    {heroSlides[currentSlide].title}
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90 font-medium mb-4">
                    {heroSlides[currentSlide].subtitle}
                  </p>
                  <p className="text-base md:text-lg text-white/70 mb-8 max-w-lg">
                    {heroSlides[currentSlide].description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 md:gap-6">
                    <span className="text-2xl md:text-3xl font-bold text-white">
                      From {heroSlides[currentSlide].price}
                    </span>
                    <Link href={`/${locale}/products`}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 md:px-8 py-3 bg-white text-neutral-900 font-semibold rounded-xl hover:bg-neutral-100 transition-colors"
                      >
                        {t("cta")}
                      </motion.button>
                    </Link>
                    <button className="flex items-center gap-2 text-white hover:text-white/80 transition-colors">
                      <Play className="w-5 h-5" />
                      <span className="font-medium hidden sm:inline">Watch Video</span>
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative hidden lg:flex items-center justify-center"
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
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0"
                    >
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                        <span className="text-2xl">📷</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
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

      {/* Categories */}
      <section className="py-12 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, i) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/${locale}/products?category=${category.slug}`}>
                  <div className="group bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all cursor-pointer">
                    <span className="text-4xl block mb-3">{category.icon}</span>
                    <h3 className="font-medium text-neutral-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">{tProducts("featured")}</h2>
              <p className="text-neutral-500 mt-1">Our most popular products</p>
            </div>
            <Link
              href={`/${locale}/products`}
              className="flex items-center gap-1 text-neutral-700 hover:text-neutral-900 font-medium transition-colors"
            >
              {tProducts("all")}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-neutral-200 rounded-2xl aspect-square mb-4" />
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-neutral-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="h-full"
                >
                  <Link href={`/${locale}/product/${product.slug}`} className="h-full block">
                    <div className="group bg-neutral-50 rounded-2xl p-4 hover:bg-neutral-100 transition-colors cursor-pointer h-full flex flex-col">
                      <div className="aspect-square relative mb-4 flex items-center justify-center bg-white rounded-xl overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.images[0].alt || product.name}
                            fill
                            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        ) : (
                          <motion.span
                            className="text-6xl"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            🛸
                          </motion.span>
                        )}
                        {product.brand && (
                          <div className="absolute top-2 right-2">
                            <span className="px-2 py-1 bg-neutral-900 text-white text-xs font-medium rounded-full">
                              {product.brand.name}
                            </span>
                          </div>
                        )}
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col flex-grow">
                        <h3 className="font-semibold text-neutral-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm min-h-[2.5rem]">
                          {product.name}
                        </h3>
                        <span className="text-xs text-neutral-500 h-4">
                          {product.category?.name || ""}
                        </span>
                        <div className="flex items-center justify-between mt-auto pt-2">
                          <div>
                            <div className="flex items-baseline gap-1">
                              <span className="text-base font-bold text-neutral-900">
                                {formatPrice(product.price)}
                              </span>
                              <span className="text-xs text-neutral-500">+ VAT</span>
                            </div>
                            <span className="text-xs text-neutral-400">
                              {formatPrice(product.price * 1.23)} brutto
                            </span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.preventDefault();
                              if (product.stock > 0) {
                                addItem({
                                  productId: product.id,
                                  name: product.name,
                                  price: product.price,
                                  quantity: 1,
                                  image: product.images?.[0]?.url,
                                  brand: product.brand?.name,
                                  stock: product.stock,
                                });
                              }
                            }}
                            disabled={product.stock === 0}
                            className="px-3 py-1.5 bg-neutral-900 text-white text-xs font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {product.stock === 0 ? "Sold Out" : tProducts("addToCart")}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: t("stats.shipping"), desc: "On orders over €100" },
              { icon: Shield, title: t("stats.warranty"), desc: "12 months manufacturer warranty" },
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
                <div className="p-3 bg-white rounded-xl shadow-sm">
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
      <section className="py-16 bg-neutral-900">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Stay Updated
            </h2>
            <p className="text-neutral-400 mb-6">
              Subscribe to our newsletter for exclusive deals and new product announcements.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-white text-neutral-900 font-semibold rounded-xl hover:bg-neutral-100 transition-colors"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
