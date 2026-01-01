"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { useCurrency } from "@/store/currency";
import { useCart } from "@/store/cart";
import {
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  GitCompare,
  Eye,
  Truck,
  Store,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Loader2,
  Pencil,
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
    images: { url: string; alt: string | null }[];
  }[];
}

// Lightbox Gallery Component
function ImageGallery({
  images,
  isOpen,
  onClose,
  initialIndex = 0
}: {
  images: { url: string; alt: string | null }[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      if (e.key === 'ArrowRight') setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 rounded-full transition-colors z-50"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Image counter */}
        <div className="absolute top-4 left-4 text-white/80 text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Main image */}
        <div
          className="relative w-full h-full max-w-5xl max-h-[80vh] mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={images[currentIndex].url}
            alt={images[currentIndex].alt || "Product image"}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/50 rounded-lg">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`relative w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                  currentIndex === index ? "border-white" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const locale = useLocale();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const t = useTranslations("product");
  const tProducts = useTranslations("products");
  const tNav = useTranslations("nav");
  const { formatPrice } = useCurrency();
  const { addItem, openCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [watchingCount] = useState(() => Math.floor(Math.random() * 20) + 5);

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
    if (!product) return;
    setIsAddingToCart(true);

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images?.[0]?.url,
      brand: product.brand?.name,
      stock: product.stock,
    });

    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsAddingToCart(false);
    openCart();
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    // Could redirect to checkout here
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
        <Link href={`/${locale}/products`} className="text-blue-600 underline">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Lightbox Gallery */}
      <ImageGallery
        images={product.images}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        initialIndex={selectedImageIndex}
      />

      {/* Breadcrumb */}
      <div className="border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link href={`/${locale}`} className="text-neutral-500 hover:text-blue-600">
              Strona główna
            </Link>
            <span className="text-neutral-300">/</span>
            {product.category && (
              <>
                <Link
                  href={`/${locale}/products?category=${product.category.slug}`}
                  className="text-neutral-500 hover:text-blue-600"
                >
                  {product.category.name}
                </Link>
                <span className="text-neutral-300">/</span>
              </>
            )}
            <span className="text-neutral-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Images */}
          <div>
            {/* Main Image */}
            <div
              className="relative aspect-square bg-white border border-neutral-200 rounded-lg overflow-hidden cursor-zoom-in group"
              onClick={() => setGalleryOpen(true)}
            >
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[selectedImageIndex].url}
                  alt={product.images[selectedImageIndex].alt || product.name}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                  <span className="text-8xl">🛸</span>
                </div>
              )}

              {/* Zoom icon */}
              <button
                className="absolute bottom-4 left-4 p-3 bg-white border border-neutral-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                onClick={(e) => {
                  e.stopPropagation();
                  setGalleryOpen(true);
                }}
              >
                <Maximize2 className="w-5 h-5 text-neutral-600" />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all ${
                      selectedImageIndex === index
                        ? "border-blue-500"
                        : "border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || `${product.name} ${index + 1}`}
                      fill
                      className="object-contain p-1"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div>
            {/* Title with Admin Edit Button */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900">
                {product.name}
              </h1>
              {isAdmin && (
                <Link
                  href={`/${locale}/admin/products/${product.id}/edit`}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shrink-0"
                >
                  <Pencil className="w-4 h-4" />
                  Editar
                </Link>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="mt-4 text-neutral-600 text-sm leading-relaxed">
                {product.description}
              </p>
            )}

            {/* SKU */}
            {product.sku && (
              <p className="mt-4 text-sm text-neutral-500">
                <span className="font-medium">SKU:</span> {product.sku} {product.brand?.name && `${product.brand.name}`}
              </p>
            )}

            {/* Price & Stock */}
            <div className="mt-4 flex items-center gap-4">
              <span className="text-3xl font-bold text-blue-600">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <span className="text-lg text-neutral-400 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 text-green-700 text-sm font-medium rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {product.stock} w magazynie
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-full">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Brak w magazynie
                </span>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="mt-6 flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-neutral-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-neutral-600 hover:text-neutral-900 disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 text-neutral-600 hover:text-neutral-900 disabled:opacity-50"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-neutral-900 text-white font-semibold rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Dodaj Do Koszyka
                  </>
                )}
              </button>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="py-3 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            {/* Wishlist & Compare */}
            <div className="mt-4 flex items-center gap-6 text-sm">
              <button className="flex items-center gap-2 text-neutral-600 hover:text-blue-600 transition-colors">
                <GitCompare className="w-4 h-4" />
                Add to compare
              </button>
              <button className="flex items-center gap-2 text-neutral-600 hover:text-red-500 transition-colors">
                <Heart className="w-4 h-4" />
                Add to wishlist
              </button>
            </div>

            {/* People watching */}
            <div className="mt-6 p-3 bg-neutral-100 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-neutral-700">
                <Eye className="w-4 h-4 text-blue-500" />
                <span><strong>{watchingCount}</strong> People watching this product now!</span>
              </div>
            </div>

            {/* Delivery Options */}
            <div className="mt-6 border border-neutral-200 rounded-lg divide-y divide-neutral-200">
              <div className="p-4 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Store className="w-5 h-5 text-neutral-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-neutral-900">Odbiór ze sklepu Drone-Partss</p>
                    <p className="text-sm text-neutral-500">Do odebrania dzisiaj</p>
                  </div>
                </div>
                <span className="text-green-600 font-medium">Bezpłatnie</span>
              </div>
              <div className="p-4 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-neutral-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-neutral-900">Courier delivery</p>
                    <p className="text-sm text-neutral-500">Nasz kurier dostarczy pod wskazany adres</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-neutral-500 text-sm">24 Godziny</span>
                  <p className="font-medium">17,80</p>
                </div>
              </div>
              <div className="p-4 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-yellow-500 text-xs font-bold">DHL</span>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">DHL Courier delivery</p>
                    <p className="text-sm text-neutral-500">Kurier DHL dostarczy pod wskazany adres</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-neutral-500 text-sm">24-48 Godziny</span>
                  <p className="font-medium">17,80</p>
                </div>
              </div>
            </div>

            {/* Warranty & Returns */}
            <div className="mt-4 border border-neutral-200 rounded-lg divide-y divide-neutral-200">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-neutral-900">Gwarancja 2 lata</span>
                </div>
                <Link href="#" className="text-blue-600 text-sm hover:underline">
                  Więcej szczegółów
                </Link>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-blue-500" />
                  <span className="text-neutral-900">Bezpłatne 14-dniowe zwroty</span>
                </div>
                <Link href="#" className="text-blue-600 text-sm hover:underline">
                  Więcej szczegółów
                </Link>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mt-6 flex items-center gap-3 flex-wrap">
              <span className="text-sm text-neutral-600">Payment Methods:</span>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 bg-[#003087] rounded text-white text-xs font-bold">PayPal</div>
                <div className="px-2 py-1.5 bg-gradient-to-r from-red-500 to-yellow-500 rounded">
                  <div className="w-8 h-4 flex items-center justify-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full -mr-1"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
                <div className="px-3 py-1.5 bg-[#1A1F71] rounded text-white text-xs font-bold">VISA</div>
                <div className="px-3 py-1.5 bg-neutral-800 rounded text-white text-xs font-bold">Maestro</div>
                <div className="px-3 py-1.5 bg-[#635BFF] rounded text-white text-xs font-bold">stripe</div>
                <div className="px-3 py-1.5 bg-black rounded text-white text-xs font-bold">Pay</div>
                <div className="px-3 py-1.5 bg-white border border-neutral-300 rounded text-neutral-800 text-xs font-bold">G Pay</div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-neutral-900 mb-8">
              Powiązane produkty
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.relatedProducts.map((related) => (
                <Link key={related.id} href={`/${locale}/product/${related.slug}`} className="h-full">
                  <div className="bg-white border border-neutral-200 rounded-lg p-4 hover:shadow-lg transition-shadow group h-full flex flex-col">
                    <div className="aspect-square bg-neutral-50 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                      {related.images && related.images.length > 0 ? (
                        <Image
                          src={related.images[0].url}
                          alt={related.images[0].alt || related.name}
                          fill
                          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      ) : (
                        <span className="text-5xl">🛸</span>
                      )}
                    </div>
                    <div className="flex flex-col flex-grow">
                      <span className="text-xs text-neutral-400 h-4">
                        {related.brand?.name || ""}
                      </span>
                      <h3 className="font-medium text-neutral-900 mt-1 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm min-h-[2.5rem]">
                        {related.name}
                      </h3>
                      <p className="text-lg font-bold text-blue-600 mt-auto pt-2">
                        {formatPrice(related.price)}
                      </p>
                    </div>
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
