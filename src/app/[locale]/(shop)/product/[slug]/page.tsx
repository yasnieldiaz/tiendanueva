"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Check,
  Loader2,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  sku: string | null;
  stock: number;
  weight: number | null;
  category: { name: string; slug: string } | null;
  brand: { name: string; slug: string; logo: string | null } | null;
  images: { url: string; alt: string | null }[];
  variants: { id: string; name: string; value: string; price: number | null; stock: number }[];
  reviews: {
    id: string;
    rating: number;
    title: string | null;
    comment: string | null;
    createdAt: string;
    user: { name: string | null; image: string | null };
  }[];
  avgRating: number;
  _count: { reviews: number };
  relatedProducts: {
    id: string;
    name: string;
    slug: string;
    price: number;
    brand: { name: string } | null;
  }[];
}

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  const t = useTranslations("product");
  const tProducts = useTranslations("products");
  const tNav = useTranslations("nav");

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsAddingToCart(false);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <p className="text-xl text-neutral-500 mb-4">Product not found</p>
        <Link href="/products" className="text-neutral-900 underline">
          Back to products
        </Link>
      </div>
    );
  }

  const currentPrice = selectedVariant
    ? product.variants.find((v) => v.id === selectedVariant)?.price || product.price
    : product.price;

  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-[1504px] mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-neutral-500 hover:text-neutral-900">
              {tNav("home")}
            </Link>
            <span className="text-neutral-300">/</span>
            <Link href="/products" className="text-neutral-500 hover:text-neutral-900">
              {tNav("products")}
            </Link>
            {product.category && (
              <>
                <span className="text-neutral-300">/</span>
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="text-neutral-500 hover:text-neutral-900"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-900">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-[1504px] mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl flex items-center justify-center relative overflow-hidden"
            >
              <motion.span
                className="text-[150px]"
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                🛸
              </motion.span>
              {product.stock === 0 && (
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-full">
                    {tProducts("outOfStock")}
                  </span>
                </div>
              )}
              {discount > 0 && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-full">
                    -{discount}%
                  </span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Details */}
          <div>
            {/* Brand */}
            {product.brand && (
              <span className="text-sm text-neutral-500 font-medium">
                {product.brand.name}
              </span>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold text-neutral-900 mt-2">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(product.avgRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-neutral-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-neutral-500">
                ({product._count.reviews} {t("reviews").toLowerCase()})
              </span>
            </div>

            {/* Price */}
            <div className="mt-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-neutral-900">
                  €{currentPrice.toFixed(2)}
                </span>
                {product.comparePrice && (
                  <span className="text-xl text-neutral-400 line-through">
                    €{product.comparePrice.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-sm text-green-600 mt-1">
                {product.stock > 0 ? (
                  <span className="flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    {tProducts("inStock")} - {product.stock} {tProducts("stock")}
                  </span>
                ) : (
                  tProducts("outOfStock")
                )}
              </p>
            </div>

            {/* Variants */}
            {product.variants.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-neutral-700 mb-3">
                  Options
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                        selectedVariant === variant.id
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 text-neutral-700 hover:border-neutral-400"
                      }`}
                    >
                      {variant.name}: {variant.value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-neutral-700 mb-3">
                {t("quantity")}
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-neutral-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-neutral-500 hover:text-neutral-900 disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-3 text-neutral-500 hover:text-neutral-900 disabled:opacity-50"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : addedToCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    {tProducts("addedToCart")}
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    {tProducts("addToCart")}
                  </>
                )}
              </motion.button>
              <button className="p-4 border border-neutral-200 rounded-xl text-neutral-500 hover:text-red-500 hover:border-red-200 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-4 border border-neutral-200 rounded-xl text-neutral-500 hover:text-neutral-900 hover:border-neutral-400 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Features */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-4 bg-neutral-50 rounded-xl">
                <Truck className="w-6 h-6 text-neutral-600 mb-2" />
                <span className="text-xs text-neutral-600">Free EU Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-neutral-50 rounded-xl">
                <Shield className="w-6 h-6 text-neutral-600 mb-2" />
                <span className="text-xs text-neutral-600">12 Month Warranty</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-neutral-50 rounded-xl">
                <RotateCcw className="w-6 h-6 text-neutral-600 mb-2" />
                <span className="text-xs text-neutral-600">30 Day Returns</span>
              </div>
            </div>

            {/* SKU */}
            {product.sku && (
              <p className="mt-6 text-sm text-neutral-500">
                {t("sku")}: {product.sku}
              </p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="border-b border-neutral-200">
            <div className="flex gap-8">
              {[
                { id: "description", label: t("description") },
                { id: "specs", label: t("specifications") },
                { id: "reviews", label: `${t("reviews")} (${product._count.reviews})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-neutral-900 text-neutral-900"
                      : "border-transparent text-neutral-500 hover:text-neutral-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="py-8">
            {activeTab === "description" && (
              <div className="prose prose-neutral max-w-none">
                <p>{product.description || "No description available."}</p>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="grid md:grid-cols-2 gap-4">
                {product.brand && (
                  <div className="flex justify-between py-3 border-b border-neutral-100">
                    <span className="text-neutral-500">{t("brand")}</span>
                    <span className="font-medium">{product.brand.name}</span>
                  </div>
                )}
                {product.category && (
                  <div className="flex justify-between py-3 border-b border-neutral-100">
                    <span className="text-neutral-500">{t("category")}</span>
                    <span className="font-medium">{product.category.name}</span>
                  </div>
                )}
                {product.sku && (
                  <div className="flex justify-between py-3 border-b border-neutral-100">
                    <span className="text-neutral-500">{t("sku")}</span>
                    <span className="font-medium">{product.sku}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="flex justify-between py-3 border-b border-neutral-100">
                    <span className="text-neutral-500">Weight</span>
                    <span className="font-medium">{product.weight} kg</span>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                {product.reviews.length === 0 ? (
                  <p className="text-neutral-500">No reviews yet.</p>
                ) : (
                  <div className="space-y-6">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="border-b border-neutral-100 pb-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {review.user.name?.[0] || "U"}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{review.user.name || "Anonymous"}</p>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3 h-3 ${
                                    star <= review.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-neutral-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        {review.title && (
                          <p className="font-medium mb-1">{review.title}</p>
                        )}
                        {review.comment && (
                          <p className="text-neutral-600">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {product.relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-neutral-900 mb-8">
              {t("relatedProducts")}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.relatedProducts.map((related) => (
                <Link key={related.id} href={`/product/${related.slug}`}>
                  <div className="bg-neutral-50 rounded-2xl p-5 hover:bg-neutral-100 transition-colors group">
                    <div className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-5xl">🛸</span>
                    </div>
                    {related.brand && (
                      <span className="text-xs text-neutral-400">{related.brand.name}</span>
                    )}
                    <h3 className="font-semibold text-neutral-900 mt-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {related.name}
                    </h3>
                    <p className="text-lg font-bold text-neutral-900 mt-2">
                      €{related.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
