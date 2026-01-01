"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
} from "lucide-react";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  recentOrders: {
    id: string;
    orderNumber: number;
    total: number;
    status: string;
    createdAt: string;
  }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "bg-blue-500",
      change: "+12%",
      up: true,
      href: `/${locale}/admin/products`,
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "bg-green-500",
      change: "+8%",
      up: true,
      href: `/${locale}/admin/orders`,
    },
    {
      title: "Total Revenue",
      value: `${(stats?.totalRevenue || 0).toFixed(2)} zł`,
      icon: DollarSign,
      color: "bg-purple-500",
      change: "+23%",
      up: true,
      href: `/${locale}/admin/orders`,
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "bg-orange-500",
      change: "+5%",
      up: true,
      href: `/${locale}/admin/customers`,
    },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-neutral-200 rounded w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-neutral-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-500 mt-1">Welcome to your admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Link key={stat.title} href={stat.href}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-sm ${
                      stat.up ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
                </div>
              </div>
              <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
              <p className="text-sm text-neutral-500 mt-1">{stat.title}</p>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-900">Recent Orders</h2>
          <a
            href="/admin/orders"
            className="text-sm text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
          >
            View all
            <TrendingUp className="w-4 h-4" />
          </a>
        </div>

        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">
                    Order
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-neutral-500">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-neutral-50 hover:bg-neutral-50"
                  >
                    <td className="py-3 px-4">
                      <span className="font-medium text-neutral-900">
                        #{order.orderNumber}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : order.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "SHIPPED"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-neutral-100 text-neutral-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-neutral-900">
                      €{order.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-500">
            No orders yet
          </div>
        )}
      </motion.div>
    </div>
  );
}
