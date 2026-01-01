"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  X,
  Truck,
  Send,
  Trash2,
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
  userId: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: string;
  shippingAddress: string;
  trackingNumber?: string;
  carrier?: string;
  items: OrderItem[];
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");
  const [sendingShipping, setSendingShipping] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [page, search, statusFilter]);

  async function fetchOrders() {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      });
      const res = await fetch(`/api/admin/orders?${params}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, status: string) {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders(
          orders.map((o) => (o.id === orderId ? { ...o, status } : o))
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status });
        }
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  }

  async function updateShippingInfo() {
    if (!selectedOrder || !trackingNumber || !carrier) return;

    setSendingShipping(true);
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}/shipping`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackingNumber,
          carrier,
          sendEmail: true,
        }),
      });

      if (res.ok) {
        const updatedOrder = {
          ...selectedOrder,
          status: "SHIPPED",
          trackingNumber,
          carrier,
        };
        setOrders(
          orders.map((o) => (o.id === selectedOrder.id ? updatedOrder : o))
        );
        setSelectedOrder(updatedOrder);
        setTrackingNumber("");
        setCarrier("");
        alert("Shipping info updated and email sent to customer!");
      } else {
        const data = await res.json();
        alert(data.error || "Error updating shipping info");
      }
    } catch (error) {
      console.error("Error updating shipping:", error);
      alert("Error updating shipping info");
    } finally {
      setSendingShipping(false);
    }
  }

  // Reset tracking form when selecting a different order
  function handleSelectOrder(order: Order) {
    setSelectedOrder(order);
    setTrackingNumber(order.trackingNumber || "");
    setCarrier(order.carrier || "");
  }

  async function deleteOrder(orderId: string) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setOrders(orders.filter((o) => o.id !== orderId));
        setDeleteConfirm(null);
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
        }
      } else {
        const data = await res.json();
        alert(data.error || "Error deleting order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Error deleting order");
    } finally {
      setDeleting(false);
    }
  }

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Orders</h1>
        <p className="text-neutral-500 mt-1">Manage customer orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by order number..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 bg-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-neutral-900 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingCart className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-neutral-500">
                    Order
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-neutral-500">
                    Date
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-neutral-500">
                    Items
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-neutral-500">
                    Status
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-neutral-500">
                    Total
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-neutral-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-neutral-50"
                  >
                    <td className="py-4 px-6">
                      <span className="font-medium text-neutral-900">
                        #{order.orderNumber}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-neutral-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-neutral-600">
                      {order.items.length} items
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${
                          statusColors[order.status] || "bg-neutral-100"
                        }`}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-neutral-900">
                      €{order.total.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleSelectOrder(order)}
                          className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(order.id)}
                          className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete order"
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-neutral-900">
                Order #{selectedOrder.orderNumber}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-500">Date</p>
                  <p className="font-medium text-neutral-900">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Status</p>
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      statusColors[selectedOrder.status] || "bg-neutral-100"
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <p className="text-sm text-neutral-500 mb-2">Shipping Address</p>
                <div className="bg-neutral-50 rounded-xl p-4">
                  {(() => {
                    try {
                      const address = JSON.parse(selectedOrder.shippingAddress);
                      return (
                        <div className="text-sm text-neutral-700">
                          <p className="font-medium">
                            {address.firstName} {address.lastName}
                          </p>
                          <p>{address.address}</p>
                          <p>
                            {address.city}, {address.postalCode}
                          </p>
                          <p>{address.country}</p>
                          <p className="mt-2">{address.email}</p>
                          <p>{address.phone}</p>
                        </div>
                      );
                    } catch {
                      return (
                        <p className="text-sm text-neutral-500">
                          {selectedOrder.shippingAddress}
                        </p>
                      );
                    }
                  })()}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <p className="text-sm text-neutral-500 mb-2">Items</p>
                <div className="bg-neutral-50 rounded-xl divide-y divide-neutral-100">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-neutral-900">
                          {item.name}
                        </p>
                        {item.variant && (
                          <p className="text-sm text-neutral-500">
                            {item.variant}
                          </p>
                        )}
                        <p className="text-sm text-neutral-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-neutral-900">
                        €{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-neutral-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="text-neutral-900">
                    €{selectedOrder.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Shipping</span>
                  <span className="text-neutral-900">
                    €{selectedOrder.shippingCost.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Tax (23%)</span>
                  <span className="text-neutral-900">
                    €{selectedOrder.tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-neutral-200">
                  <span>Total</span>
                  <span>€{selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Shipping Tracking */}
              <div className="border-t border-neutral-200 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="w-5 h-5 text-neutral-700" />
                  <h3 className="font-semibold text-neutral-900">Shipping Information</h3>
                </div>

                {selectedOrder.trackingNumber ? (
                  <div className="bg-purple-50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-600">Carrier</span>
                      <span className="font-medium text-purple-900">{selectedOrder.carrier}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-600">Tracking Number</span>
                      <span className="font-mono font-medium text-purple-900">{selectedOrder.trackingNumber}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Carrier
                        </label>
                        <select
                          value={carrier}
                          onChange={(e) => setCarrier(e.target.value)}
                          className="w-full px-4 py-2 bg-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        >
                          <option value="">Select carrier...</option>
                          <option value="DHL">DHL</option>
                          <option value="FedEx">FedEx</option>
                          <option value="UPS">UPS</option>
                          <option value="DPD">DPD</option>
                          <option value="InPost">InPost</option>
                          <option value="Poczta Polska">Poczta Polska</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Tracking Number
                        </label>
                        <input
                          type="text"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="Enter tracking number..."
                          className="w-full px-4 py-2 bg-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        />
                      </div>
                    </div>
                    <button
                      onClick={updateShippingInfo}
                      disabled={!trackingNumber || !carrier || sendingShipping}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      {sendingShipping ? "Sending..." : "Mark as Shipped & Send Email"}
                    </button>
                    <p className="text-xs text-neutral-500 text-center">
                      This will update the order status to &quot;Shipped&quot; and send a shipping confirmation email to the customer.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Delete Order?
              </h3>
              <p className="text-neutral-500 mb-6">
                Are you sure you want to delete this order? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={deleting}
                  className="flex-1 px-4 py-3 bg-neutral-100 text-neutral-700 font-medium rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteOrder(deleteConfirm)}
                  disabled={deleting}
                  className="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
