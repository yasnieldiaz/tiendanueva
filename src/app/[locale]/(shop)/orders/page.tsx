"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Package,
  ChevronRight,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  ShoppingBag,
} from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
}

interface Order {
  id: string;
  orderNumber: number;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  PENDING: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
  PROCESSING: { icon: Package, color: "text-blue-600", bg: "bg-blue-100" },
  SHIPPED: { icon: Truck, color: "text-purple-600", bg: "bg-purple-100" },
  DELIVERED: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
  CANCELLED: { icon: XCircle, color: "text-red-600", bg: "bg-red-100" },
};

export default function OrdersPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("account");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push(`/${locale}/login`);
    }
  }, [authStatus, router, locale]);

  useEffect(() => {
    async function fetchOrders() {
      if (authStatus !== "authenticated") return;

      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [authStatus]);

  if (authStatus === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-neutral-200 rounded w-48" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-neutral-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (authStatus === "unauthenticated") {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">{t("orders")}</h1>
          <p className="text-neutral-500 mb-8">
            {session?.user?.name ? `${t("title")}, ${session.user.name}` : t("title")}
          </p>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <ShoppingBag className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              {t("noOrders")}
            </h2>
            <p className="text-neutral-500 mb-6">
              Start shopping to see your orders here
            </p>
            <Link href={`/${locale}/products`}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-800"
              >
                Browse Products
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const StatusIcon = statusConfig[order.status]?.icon || Package;
              const statusColor = statusConfig[order.status]?.color || "text-neutral-600";
              const statusBg = statusConfig[order.status]?.bg || "bg-neutral-100";

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl border border-neutral-200 overflow-hidden"
                >
                  <button
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                    className="w-full p-6 flex items-center justify-between hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${statusBg} rounded-xl flex items-center justify-center`}>
                        <StatusIcon className={`w-6 h-6 ${statusColor}`} />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-neutral-900">
                          Order #{order.orderNumber}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} items
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-neutral-900">
                          €{order.total.toFixed(2)}
                        </p>
                        <p className={`text-sm font-medium ${statusColor}`}>
                          {order.status}
                        </p>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 text-neutral-400 transition-transform ${
                          selectedOrder?.id === order.id ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Expanded Order Details */}
                  {selectedOrder?.id === order.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-neutral-100"
                    >
                      <div className="p-6 space-y-4">
                        <h3 className="font-medium text-neutral-900">Order Items</h3>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0"
                            >
                              <div>
                                <p className="font-medium text-neutral-900">{item.name}</p>
                                {item.variant && (
                                  <p className="text-sm text-neutral-500">{item.variant}</p>
                                )}
                                <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                              </div>
                              <p className="font-medium text-neutral-900">
                                €{(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
