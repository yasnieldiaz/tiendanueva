"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Tags, X, Save } from "lucide-react";

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

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState<{
    type: "category" | "brand";
    mode: "create" | "edit";
    id?: string;
    name: string;
    slug: string;
  } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    type: "category" | "brand";
    id: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [catRes, brandRes] = await Promise.all([
        fetch("/api/admin/categories"),
        fetch("/api/admin/brands"),
      ]);

      if (catRes.ok) {
        const data = await catRes.json();
        setCategories(data);
      }
      if (brandRes.ok) {
        const data = await brandRes.json();
        setBrands(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function handleSave() {
    if (!editModal) return;
    setSaving(true);

    try {
      const endpoint =
        editModal.type === "category"
          ? "/api/admin/categories"
          : "/api/admin/brands";
      const method = editModal.mode === "create" ? "POST" : "PUT";
      const url =
        editModal.mode === "create"
          ? endpoint
          : `${endpoint}/${editModal.id}`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editModal.name,
          slug: editModal.slug,
        }),
      });

      if (res.ok) {
        fetchData();
        setEditModal(null);
      } else {
        const data = await res.json();
        alert(data.error || "Error saving");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteModal) return;

    try {
      const endpoint =
        deleteModal.type === "category"
          ? "/api/admin/categories"
          : "/api/admin/brands";

      const res = await fetch(`${endpoint}/${deleteModal.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchData();
        setDeleteModal(null);
      } else {
        const data = await res.json();
        alert(data.error || "Error deleting");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error deleting");
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-neutral-200 rounded w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-64 bg-neutral-200 rounded-2xl" />
            <div className="h-64 bg-neutral-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Categories & Brands</h1>
        <p className="text-neutral-500 mt-1">Manage product organization</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900">Categories</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setEditModal({
                  type: "category",
                  mode: "create",
                  name: "",
                  slug: "",
                })
              }
              className="p-2 bg-neutral-900 text-white rounded-lg"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>

          {categories.length === 0 ? (
            <div className="p-8 text-center">
              <Tags className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500">No categories yet</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 flex items-center justify-between hover:bg-neutral-50"
                >
                  <div>
                    <p className="font-medium text-neutral-900">
                      {category.name}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {category._count.products} products
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setEditModal({
                          type: "category",
                          mode: "edit",
                          id: category.id,
                          name: category.name,
                          slug: category.slug,
                        })
                      }
                      className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteModal({ type: "category", id: category.id })
                      }
                      className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Brands */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900">Brands</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setEditModal({
                  type: "brand",
                  mode: "create",
                  name: "",
                  slug: "",
                })
              }
              className="p-2 bg-neutral-900 text-white rounded-lg"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>

          {brands.length === 0 ? (
            <div className="p-8 text-center">
              <Tags className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500">No brands yet</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {brands.map((brand, index) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 flex items-center justify-between hover:bg-neutral-50"
                >
                  <div>
                    <p className="font-medium text-neutral-900">{brand.name}</p>
                    <p className="text-sm text-neutral-500">
                      {brand._count.products} products
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setEditModal({
                          type: "brand",
                          mode: "edit",
                          id: brand.id,
                          name: brand.name,
                          slug: brand.slug,
                        })
                      }
                      className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteModal({ type: "brand", id: brand.id })
                      }
                      className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-neutral-900">
                {editModal.mode === "create" ? "Create" : "Edit"}{" "}
                {editModal.type === "category" ? "Category" : "Brand"}
              </h3>
              <button
                onClick={() => setEditModal(null)}
                className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={editModal.name}
                  onChange={(e) =>
                    setEditModal({
                      ...editModal,
                      name: e.target.value,
                      slug:
                        editModal.mode === "create"
                          ? generateSlug(e.target.value)
                          : editModal.slug,
                    })
                  }
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={editModal.slug}
                  onChange={(e) =>
                    setEditModal({ ...editModal, slug: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  placeholder="url-slug"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setEditModal(null)}
                className="flex-1 py-3 px-4 bg-neutral-100 text-neutral-700 rounded-xl font-medium hover:bg-neutral-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !editModal.name || !editModal.slug}
                className="flex-1 py-3 px-4 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4"
          >
            <h3 className="text-lg font-bold text-neutral-900 mb-2">
              Delete {deleteModal.type === "category" ? "Category" : "Brand"}?
            </h3>
            <p className="text-neutral-500 mb-6">
              This action cannot be undone. Products using this{" "}
              {deleteModal.type} will be unassigned.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 py-2 px-4 bg-neutral-100 text-neutral-700 rounded-xl font-medium hover:bg-neutral-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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
