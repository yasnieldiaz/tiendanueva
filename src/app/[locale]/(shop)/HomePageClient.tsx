"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { ChevronRight, ChevronLeft, Truck, Shield, Headphones, CreditCard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useCart } from "@/store/cart";
import { useCurrency } from "@/store/currency";

// Slider configuration
const heroSlides = [
  {
    id: 1,
    image: "/images/slider/slide1-repair.jpg",
    title: "Drone Repair Service",
    subtitle: "Expert Technicians",
    description: "Professional repair and maintenance for all drone brands",
    buttonText: "Contact Us",
    buttonLink: "/contact",
  },
  {
    id: 2,
    image: "/images/slider/slide2-service.jpg",
    title: "Technical Support",
    subtitle: "Certified Service",
    description: "Diagnostics, calibration and software updates",
    buttonText: "Learn More",
    buttonLink: "/contact",
  },
];

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

interface BrandSection {
  brand: string;
  slug: string;
  products: Product[];
}

const categories = [
  { name: "DJI Mavic 4", slug: "dji-mavic-4", icon: "🛸" },
  { name: "DJI Mini 5 Pro", slug: "dji-mini-5-pro", icon: "✈️" },
  { name: "DJI Enterprise", slug: "dji-enterprise", icon: "🎯" },
  { name: "Autel Max", slug: "autel-max", icon: "🎮" },
  { name: "XAG Agricultural", slug: "xag-agricultural", icon: "🌾" },
  { name: "Batteries", slug: "batteries", icon: "🔋" },
];

export default function HomePageClient() {
  const t = useTranslations("hero");
  const tProducts = useTranslations("products");
  const locale = useLocale();
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [brandProducts, setBrandProducts] = useState<BrandSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Slider navigation
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  }, []);

  // Autoplay effect
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Fetch all products in parallel for better performance
  useEffect(() => {
    async function fetchAllProducts() {
      try {
        const targetBrands = [
          { name: "XAG", slug: "xag" },
          { name: "Autel", slug: "autel" },
          { name: "FIMI", slug: "fimi" },
        ];

        // Fetch featured products and all brand products in parallel
        const [featuredRes, ...brandResponses] = await Promise.all([
          fetch("/api/products?featured=true&limit=8"),
          ...targetBrands.map(brand => fetch(`/api/products?brand=${brand.slug}&limit=8`))
        ]);

        // Process featured products
        if (featuredRes.ok) {
          const data = await featuredRes.json();
          setFeaturedProducts(data.products || []);
        }

        // Process brand products
        const brandsWithProducts: BrandSection[] = [];
        for (let i = 0; i < brandResponses.length; i++) {
          if (brandResponses[i].ok) {
            const data = await brandResponses[i].json();
            if (data.products && data.products.length > 0) {
              brandsWithProducts.push({
                brand: targetBrands[i].name,
                slug: targetBrands[i].slug,
                products: data.products,
              });
            }
          }
        }
        setBrandProducts(brandsWithProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllProducts();
  }, []);


  return (
    <div className="bg-white">
      {/* Hero Slider Section */}
      <section className="relative bg-black overflow-hidden">
        <div className="relative w-full h-[50vh] md:h-[70vh] md:max-h-[600px]">
          {/* Slides */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              {/* Background Image */}
              <Image
                src={heroSlides[currentSlide].image}
                alt={heroSlides[currentSlide].title}
                fill
                className="object-cover"
                priority={currentSlide === 0}
                sizes="100vw"
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={() => { prevSlide(); setIsAutoPlaying(false); setTimeout(() => setIsAutoPlaying(true), 5000); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full transition-colors z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>
          <button
            onClick={() => { nextSlide(); setIsAutoPlaying(false); setTimeout(() => setIsAutoPlaying(true), 5000); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full transition-colors z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-white w-8 md:w-10"
                    : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
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
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">{tProducts("featured")}</h2>
            <p className="text-neutral-500 mt-1">{tProducts("featuredSubtitle")}</p>
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
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              const placeholder = document.createElement('div');
                              placeholder.className = 'absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-neutral-100';
                              placeholder.innerHTML = '<span class="text-5xl mb-2">🛸</span><span class="text-xs text-neutral-400 font-medium">' + (product.brand?.name || 'Dron') + '</span>';
                              parent.appendChild(placeholder);
                            }
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-neutral-100">
                          <motion.span
                            className="text-5xl mb-2"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            🛸
                          </motion.span>
                          <span className="text-xs text-neutral-400 font-medium">{product.brand?.name || "Dron"}</span>
                        </div>
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

      {/* Products by Brand */}
      {brandProducts.map((brandSection, brandIndex) => (
        <section key={brandSection.slug} className={`py-16 ${brandIndex % 2 === 0 ? 'bg-neutral-50' : 'bg-white'}`}>
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">{brandSection.brand}</h2>
                <p className="text-neutral-500 mt-1">{tProducts("featuredSubtitle")}</p>
              </div>
              <Link
                href={`/${locale}/products?brand=${brandSection.slug}`}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
              >
                {tProducts("viewDetails")}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {brandSection.products.slice(0, 8).map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="h-full"
                >
                  <Link href={`/${locale}/product/${product.slug}`} className="h-full block">
                    <div className="group bg-white rounded-2xl p-4 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col border border-neutral-100">
                      <div className="aspect-square relative mb-4 flex items-center justify-center bg-neutral-50 rounded-xl overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.images[0].alt || product.name}
                            fill
                            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-neutral-100">
                            <span className="text-5xl mb-2">🛸</span>
                            <span className="text-xs text-neutral-400 font-medium">{product.brand?.name || "Dron"}</span>
                          </div>
                        )}
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full">
                              {tProducts("outOfStock")}
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
                            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {product.stock === 0 ? tProducts("outOfStock") : tProducts("addToCart")}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

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
