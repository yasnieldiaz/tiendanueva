"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  Users,
  Mail,
  Phone,
  ShoppingBag,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";

interface Customer {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: "CUSTOMER" | "ADMIN";
  createdAt: string;
  ordersCount: number;
  totalSpent: number;
  lastOrder: string | null;
}

interface CustomerForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: "CUSTOMER" | "ADMIN";
}

const defaultForm: CustomerForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  role: "CUSTOMER",
};

export default function CustomersPage() {
  const t = useTranslations("admin");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState<CustomerForm>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
      });

      const res = await fetch(`/api/admin/customers?${params}`);
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  function openCreateModal() {
    setEditingCustomer(null);
    setForm(defaultForm);
    setShowModal(true);
  }

  function openEditModal(customer: Customer) {
    setEditingCustomer(customer);
    setForm({
      name: customer.name || "",
      email: customer.email,
      phone: customer.phone || "",
      password: "",
      confirmPassword: "",
      role: customer.role,
    });
    setShowModal(true);
  }

  function openDeleteModal(customer: Customer) {
    setDeletingCustomer(customer);
    setShowDeleteModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!editingCustomer && form.password !== form.confirmPassword) {
      setToast({ type: "error", message: "Las contraseñas no coinciden" });
      return;
    }

    if (!editingCustomer && form.password.length < 6) {
      setToast({ type: "error", message: "La contraseña debe tener al menos 6 caracteres" });
      return;
    }

    setSaving(true);

    try {
      const url = editingCustomer
        ? `/api/admin/customers/${editingCustomer.id}`
        : "/api/admin/customers";

      const method = editingCustomer ? "PUT" : "POST";

      const body: Partial<CustomerForm> = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role,
      };

      // Only include password if provided
      if (form.password) {
        body.password = form.password;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setToast({
          type: "success",
          message: editingCustomer
            ? t("customers.customerUpdated")
            : t("customers.customerCreated"),
        });
        setShowModal(false);
        fetchCustomers();
      } else {
        const data = await res.json();
        setToast({ type: "error", message: data.error || "Error" });
      }
    } catch (error) {
      console.error("Error saving customer:", error);
      setToast({ type: "error", message: "Error al guardar" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deletingCustomer) return;

    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/customers/${deletingCustomer.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setToast({ type: "success", message: t("customers.customerDeleted") });
        setShowDeleteModal(false);
        setDeletingCustomer(null);
        fetchCustomers();
      } else {
        const data = await res.json();
        setToast({ type: "error", message: data.error || "Error" });
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      setToast({ type: "error", message: "Error al eliminar" });
    } finally {
      setDeleting(false);
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(amount);
  }

  return (
    <div className="p-8">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            {t("customers.title")}
          </h1>
          <p className="text-neutral-500 mt-1">{t("customers.subtitle")}</p>
        </div>
        <motion.button
          onClick={openCreateModal}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white font-medium rounded-xl hover:bg-neutral-800"
        >
          <Plus className="w-5 h-5" />
          {t("customers.addCustomer")}
        </motion.button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={t("search")}
            className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
          </div>
        ) : customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
            <Users className="w-16 h-16 mb-4 text-neutral-300" />
            <p className="text-lg font-medium">{t("customers.noCustomers")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                    {t("customers.name")}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                    {t("customers.email")}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                    {t("customers.phone")}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                    {t("customers.role")}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                    {t("customers.orders")}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                    {t("customers.totalSpent")}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                    {t("customers.registered")}
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-900">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-neutral-600">
                            {customer.name?.[0]?.toUpperCase() || customer.email[0].toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-neutral-900">
                          {customer.name || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-neutral-600">
                        <Mail className="w-4 h-4" />
                        {customer.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {customer.phone ? (
                        <div className="flex items-center gap-2 text-neutral-600">
                          <Phone className="w-4 h-4" />
                          {customer.phone}
                        </div>
                      ) : (
                        <span className="text-neutral-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          customer.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {customer.role === "ADMIN"
                          ? t("customers.roleAdmin")
                          : t("customers.roleCustomer")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-neutral-600">
                        <ShoppingBag className="w-4 h-4" />
                        {customer.ordersCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-neutral-900">
                      {formatCurrency(customer.totalSpent)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-neutral-600">
                        <Calendar className="w-4 h-4" />
                        {formatDate(customer.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(customer)}
                          className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(customer)}
                          className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-neutral-200">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-lg font-medium ${
                  p === page
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                <h2 className="text-xl font-bold text-neutral-900">
                  {editingCustomer ? t("editCustomer") : t("newCustomer")}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t("customers.name")}
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    placeholder="Juan García"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t("customers.email")} *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    placeholder="cliente@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t("customers.phone")}
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    placeholder="+48 123 456 789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t("customers.password")} {!editingCustomer && "*"}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required={!editingCustomer}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full px-4 py-3 pr-12 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      placeholder={editingCustomer ? "Dejar vacío para no cambiar" : "••••••••"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {!editingCustomer && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      {t("customers.confirmPassword")} *
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      required={!editingCustomer}
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      placeholder="••••••••"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t("customers.role")}
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value as "CUSTOMER" | "ADMIN" })}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  >
                    <option value="CUSTOMER">{t("customers.roleCustomer")}</option>
                    <option value="ADMIN">{t("customers.roleAdmin")}</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 text-neutral-700 font-medium bg-neutral-100 rounded-xl hover:bg-neutral-200"
                  >
                    {t("cancel")}
                  </button>
                  <motion.button
                    type="submit"
                    disabled={saving}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-neutral-900 text-white font-medium rounded-xl hover:bg-neutral-800 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t("saving")}
                      </>
                    ) : editingCustomer ? (
                      t("update")
                    ) : (
                      t("create")
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && deletingCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>

              <h2 className="text-xl font-bold text-neutral-900 text-center mb-2">
                {t("customers.deleteConfirm")}
              </h2>

              <p className="text-neutral-600 text-center mb-2">
                <strong>{deletingCustomer.name || deletingCustomer.email}</strong>
              </p>

              <p className="text-neutral-500 text-sm text-center mb-6">
                {t("customers.deleteWarning")}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 text-neutral-700 font-medium bg-neutral-100 rounded-xl hover:bg-neutral-200"
                >
                  {t("cancel")}
                </button>
                <motion.button
                  onClick={handleDelete}
                  disabled={deleting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      {t("delete")}
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
