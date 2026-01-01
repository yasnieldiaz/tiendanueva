"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/store/cart";

export default function CartPage() {
  const t = useTranslations("cart");
  const tNav = useTranslations("nav");
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCart();

  const subtotal = getTotalPrice();
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const tax = subtotal * 0.23; // 23% VAT for Poland
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[1504px] mx-auto px-6 py-16">
          <div className="text-center py-20">
            <ShoppingBag className="w-24 h-24 text-neutral-200 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">{t("empty")}</h1>
            <p className="text-neutral-500 mb-8">
              Start shopping to add items to your cart
            </p>
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
              >
                {t("continueShopping")}
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-[1504px] mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/products"
              className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("continueShopping")}
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900">{t("title")}</h1>
          <p className="text-neutral-500 mt-2">
            {items.length} {t("items")}
          </p>
        </div>
      </div>

      <div className="max-w-[1504px] mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-6 p-6 bg-neutral-50 rounded-2xl"
                >
                  {/* Image */}
                  <div className="w-32 h-32 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-5xl">🛸</span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        {item.brand && (
                          <span className="text-sm text-neutral-500">{item.brand}</span>
                        )}
                        <h3 className="font-semibold text-neutral-900 text-lg">
                          {item.name}
                        </h3>
                        {item.variant && (
                          <p className="text-sm text-neutral-400 mt-1">{item.variant}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex items-center border border-neutral-200 rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-2.5 text-neutral-400 hover:text-neutral-900 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="p-2.5 text-neutral-400 hover:text-neutral-900 transition-colors disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-xl font-bold text-neutral-900">
                          €{(item.price * item.quantity).toFixed(2)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-neutral-400">
                            €{item.price.toFixed(2)} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Clear Cart */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={clearCart}
                className="text-sm text-neutral-500 hover:text-red-500 transition-colors"
              >
                Clear cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-50 rounded-2xl p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-neutral-500">{t("subtotal")}</span>
                  <span className="font-medium">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">{t("shipping")}</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `€${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">{t("tax")} (23% VAT)</span>
                  <span className="font-medium">€{tax.toFixed(2)}</span>
                </div>

                {subtotal < 100 && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Add €{(100 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}

                <div className="border-t border-neutral-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>{t("total")}</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link href="/checkout" className="block mt-6">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
                >
                  {t("checkout")}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>

              {/* Payment Methods */}
              <div className="mt-6 text-center">
                <p className="text-xs text-neutral-400 mb-3">Secure payment with</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="px-3 py-1 bg-white border border-neutral-200 rounded text-xs font-medium">
                    VISA
                  </div>
                  <div className="px-3 py-1 bg-white border border-neutral-200 rounded text-xs font-medium">
                    Mastercard
                  </div>
                  <div className="px-3 py-1 bg-white border border-neutral-200 rounded text-xs font-medium">
                    PayPal
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
