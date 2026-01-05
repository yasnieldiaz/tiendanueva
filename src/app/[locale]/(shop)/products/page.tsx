"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronRight,
  Grid3X3,
  List,
  ShoppingCart,
  ArrowLeft,
  Loader2,
  Menu,
} from "lucide-react";
import { useCurrency } from "@/store/currency";
import { useCart } from "@/store/cart";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  stock: number;
  category: { name: string; slug: string } | null;
  brand: { name: string; slug: string } | null;
  images: { url: string; alt: string | null }[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
}

interface Brand {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
}

const sortOptions = [
  { value: "newest", label: "sortOptions.newest" },
  { value: "priceAsc", label: "sortOptions.priceAsc" },
  { value: "priceDesc", label: "sortOptions.priceDesc" },
  { value: "nameAsc", label: "sortOptions.nameAsc" },
  { value: "nameDesc", label: "sortOptions.nameDesc" },
];

// Hierarchical category structure like drone-partss.com
const categoryStructure = [
  { name: "XAG", slug: "xag", subcategories: [] },
  { name: "DJI Neo", slug: "dji-neo", subcategories: [] },
  { name: "DJI Flip", slug: "dji-flip", subcategories: [] },
  { name: "FIMI Drone Series", slug: "fimi", subcategories: [] },
  {
    name: "Autel Robotics",
    slug: "autel-robotics",
    subcategories: [
      { name: "Autel Max 4T", slug: "autel-max-4t" },
      { name: "Autel Evo II V3", slug: "autel-evo-ii-v3" },
      { name: "Autel Evo 2 V2", slug: "autel-evo-2-v2" },
      { name: "Autel Lite", slug: "autel-lite" },
    ]
  },
  {
    name: "DJI Mavic Pro",
    slug: "dji-mavic",
    subcategories: [
      { name: "DJI Mavic 4 Pro", slug: "dji-mavic-4-pro" },
      { name: "DJI Mavic 3 Pro", slug: "dji-mavic-3-pro" },
      { name: "DJI Mavic 3 Classic", slug: "dji-mavic-3-classic" },
    ]
  },
  { name: "DJI FPV", slug: "dji-fpv", subcategories: [] },
  {
    name: "DJI Avata Series",
    slug: "dji-avata",
    subcategories: [
      { name: "DJI Avata 2", slug: "dji-avata-2" },
      { name: "DJI Avata", slug: "dji-avata-1" },
    ]
  },
  {
    name: "DJI Enterprises",
    slug: "dji-enterprise",
    subcategories: [
      { name: "DJI Matrice 4 Series", slug: "dji-matrice-4" },
      { name: "DJI Matrice 350 RTK", slug: "dji-matrice-350-rtk" },
      { name: "DJI M30T", slug: "dji-m30t" },
      { name: "DJI Inspire 2", slug: "dji-inspire-2" },
    ]
  },
  {
    name: "DJI Mavic 2 Series",
    slug: "dji-mavic-2",
    subcategories: [
      { name: "DJI Mavic 2 Pro", slug: "dji-mavic-2-pro" },
      { name: "DJI Mavic 2 Zoom", slug: "dji-mavic-2-zoom" },
    ]
  },
  {
    name: "DJI Mavic Air Series",
    slug: "dji-mavic-air",
    subcategories: [
      { name: "DJI Air 3", slug: "dji-air-3" },
      { name: "DJI Air 2S", slug: "dji-air-2s" },
      { name: "DJI Mavic Air 2", slug: "dji-mavic-air-2" },
    ]
  },
  {
    name: "DJI Mavic Mini Series",
    slug: "dji-mini",
    subcategories: [
      { name: "DJI Mini 4 Pro", slug: "dji-mini-4-pro" },
      { name: "DJI Mini 3 Pro", slug: "dji-mini-3-pro" },
      { name: "DJI Mini 3", slug: "dji-mini-3" },
      { name: "DJI Mini 2", slug: "dji-mini-2" },
    ]
  },
  { name: "Akcesoria", slug: "akcesoria", subcategories: [] },
];

function ProductsContent() {
  const t = useTranslations("products");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();

  // Get initial values from URL params
  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "";
  const urlBrand = searchParams.get("brand") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (slug: string) => {
    setExpandedCategories(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  // Filters - initialize from URL params
  const [search, setSearch] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [selectedBrand, setSelectedBrand] = useState(urlBrand);
  const [sort, setSort] = useState("newest");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        sort,
      });

      if (search) params.append("search", search);
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedBrand) params.append("brand", selectedBrand);
      if (priceRange.min) params.append("minPrice", priceRange.min);
      if (priceRange.max) params.append("maxPrice", priceRange.max);

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();

      setProducts(data.products || []);
      setTotalPages(data.pagination?.pages || 1);
      setTotal(data.pagination?.total || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, sort, search, selectedCategory, selectedBrand, priceRange]);

  const fetchFilters = async () => {
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/brands"),
      ]);

      const categoriesData = await categoriesRes.json();
      const brandsData = await brandsRes.json();

      setCategories(categoriesData || []);
      setBrands(brandsData || []);
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  // Update filters when URL params change
  useEffect(() => {
    setSearch(urlSearch);
    setSelectedCategory(urlCategory);
    setSelectedBrand(urlBrand);
    setPage(1);
  }, [urlSearch, urlCategory, urlBrand]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedBrand("");
    setPriceRange({ min: "", max: "" });
    setPage(1);
  };

  const hasActiveFilters = search || selectedCategory || selectedBrand || priceRange.min || priceRange.max;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {tNav("home")}
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900">{t("title")}</h1>
          <p className="text-neutral-500 mt-2">
            {total} {t("all").toLowerCase()}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Main Content - Full Width */}
          <div>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg text-neutral-600"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {t("filter")}
                </button>

                {/* View Mode */}
                <div className="hidden sm:flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm text-neutral-900"
                        : "text-neutral-500"
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "list"
                        ? "bg-white shadow-sm text-neutral-900"
                        : "text-neutral-500"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none px-4 py-2 pr-10 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {t(option.label)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {search && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 rounded-full text-sm">
                    Search: {search}
                    <button onClick={() => setSearch("")}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 rounded-full text-sm">
                    {categories.find((c) => c.slug === selectedCategory)?.name}
                    <button onClick={() => setSelectedCategory("")}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedBrand && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 rounded-full text-sm">
                    {brands.find((b) => b.slug === selectedBrand)?.name}
                    <button onClick={() => setSelectedBrand("")}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Products Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-neutral-500 text-lg">{t("noProducts")}</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-6 py-2 bg-neutral-900 text-white rounded-lg"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
                    : "space-y-4"
                }
              >
                {products.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="h-full"
                  >
                    <Link href={`/${locale}/product/${product.slug}`} className="h-full block">
                      <div
                        className={`group h-full ${
                          viewMode === "grid"
                            ? "bg-white border border-neutral-200 rounded-xl p-4 hover:shadow-lg flex flex-col"
                            : "flex gap-4 bg-white border border-neutral-200 rounded-xl p-4 hover:shadow-lg"
                        } transition-all cursor-pointer`}
                      >
                        {/* Image */}
                        <div
                          className={`${
                            viewMode === "grid"
                              ? "aspect-square mb-4"
                              : "w-32 h-32 flex-shrink-0"
                          } bg-neutral-50 rounded-lg flex items-center justify-center relative overflow-hidden`}
                        >
                          {product.images && product.images.length > 0 ? (
                            <Image
                              src={product.images[0].url}
                              alt={product.images[0].alt || product.name}
                              fill
                              className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 50vw, 33vw"
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
                          {product.stock === 0 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {t("outOfStock")}
                              </span>
                            </div>
                          )}
                          {product.brand && (
                            <div className="absolute top-2 left-2">
                              <span className="px-2 py-1 bg-neutral-900 text-white text-xs font-medium rounded-full">
                                {product.brand.name}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className={viewMode === "list" ? "flex-1" : "flex flex-col flex-grow"}>
                          <span className="text-xs text-neutral-400 font-medium h-4">
                            {product.category?.name || ""}
                          </span>
                          <h3 className="font-semibold text-neutral-900 mt-1 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm min-h-[2.5rem]">
                            {product.name}
                          </h3>
                          {viewMode === "list" && product.description && (
                            <p className="text-sm text-neutral-500 mt-2 line-clamp-2">
                              {product.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-auto pt-3">
                            <div>
                              <div className="flex items-baseline gap-1">
                                <span className="text-base font-bold text-neutral-900">
                                  {formatPrice(product.price)}
                                </span>
                                <span className="text-xs text-neutral-500">+ VAT</span>
                              </div>
                              <div className="text-xs text-neutral-400">
                                {formatPrice(product.price * 1.23)} brutto
                              </div>
                              {product.comparePrice && (
                                <span className="text-sm text-neutral-400 line-through">
                                  {formatPrice(product.comparePrice)}
                                </span>
                              )}
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
                              disabled={product.stock === 0}
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
                            >
                              <ShoppingCart className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      page === p
                        ? "bg-neutral-900 text-white"
                        : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">{t("filter")}</h2>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Same filters as sidebar */}
                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Search
                    </label>
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={tNav("search")}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg"
                    />
                  </div>

                  {/* Categories */}
                  <div>
                    <h3 className="text-sm font-medium text-neutral-900 mb-3">
                      {tNav("categories")}
                    </h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() =>
                            setSelectedCategory(
                              selectedCategory === category.slug
                                ? ""
                                : category.slug
                            )
                          }
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                            selectedCategory === category.slug
                              ? "bg-neutral-900 text-white"
                              : "text-neutral-600 hover:bg-neutral-100"
                          }`}
                        >
                          <span>{category.name}</span>
                          <span className="text-xs opacity-60">
                            ({category._count.products})
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Brands */}
                  <div>
                    <h3 className="text-sm font-medium text-neutral-900 mb-3">
                      {tNav("brands")}
                    </h3>
                    <div className="space-y-2">
                      {brands.map((brand) => (
                        <button
                          key={brand.id}
                          onClick={() =>
                            setSelectedBrand(
                              selectedBrand === brand.slug ? "" : brand.slug
                            )
                          }
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                            selectedBrand === brand.slug
                              ? "bg-neutral-900 text-white"
                              : "text-neutral-600 hover:bg-neutral-100"
                          }`}
                        >
                          <span>{brand.name}</span>
                          <span className="text-xs opacity-60">
                            ({brand._count.products})
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <div className="mt-8">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full py-3 bg-neutral-900 text-white font-semibold rounded-lg"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductsLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="h-8 bg-neutral-200 rounded w-48 animate-pulse mb-4" />
          <div className="h-6 bg-neutral-200 rounded w-32 animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-neutral-200 rounded-xl aspect-square mb-3" />
              <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-neutral-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  );
}
