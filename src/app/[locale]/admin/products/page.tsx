"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  image: string | null;
  category: { name: string } | null;
  brand: { name: string } | null;
  createdAt: string;
}

export default function AdminProductsPage() {
  const locale = useLocale();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  async function fetchProducts() {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
      });
      const res = await fetch(`/api/admin/products?${params}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
        setDeleteModal(null);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Products</h1>
          <p className="text-neutral-500 mt-1">Manage your product catalog</p>
        </div>
        <Link href={`/${locale}/admin/products/new`}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-xl font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </motion.button>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-neutral-900 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-neutral-500">
                    Product
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-neutral-500">
                    Category
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-neutral-500">
                    Brand
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-neutral-500">
                    Price
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-neutral-500">
                    Stock
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-neutral-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {products.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-neutral-50"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center text-2xl">
                          {product.image || "📦"}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">
                            {product.name}
                          </p>
                          <p className="text-sm text-neutral-500">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-neutral-600">
                      {product.category?.name || "-"}
                    </td>
                    <td className="py-4 px-6 text-neutral-600">
                      {product.brand?.name || "-"}
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-neutral-900">
                      €{product.price.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          product.stock > 10
                            ? "bg-green-100 text-green-700"
                            : product.stock > 0
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/${locale}/admin/products/${product.id}/edit`}>
                          <button className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => setDeleteModal(product.id)}
                          className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-100">
            <p className="text-sm text-neutral-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4"
          >
            <h3 className="text-lg font-bold text-neutral-900 mb-2">
              Delete Product?
            </h3>
            <p className="text-neutral-500 mb-6">
              This action cannot be undone. Are you sure you want to delete this
              product?
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 py-2 px-4 bg-neutral-100 text-neutral-700 rounded-xl font-medium hover:bg-neutral-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal)}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
